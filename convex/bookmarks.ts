import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

// You can get the current user from the auth component
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

export const listBookmarks = query({
  args: {
    date: v.string(),
    twitterUsername: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const selectedDate = new Date(args.date);

    const dayStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0,
      0,
      0,
      0
    ).getTime();

    const dayEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23,
      59,
      59,
      999
    ).getTime();

    return await ctx.db
      .query("bookmarked_tweets")
      .filter((q) =>
        q.and(
          q.eq(q.field("tweetBy.userName"), args.twitterUsername),
          q.gte(q.field("_creationTime"), dayStart),
          q.lte(q.field("_creationTime"), dayEnd)
        )
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

type Tweet = Doc<"bookmarked_tweets"> & {
  screenshotUrl: string | null;
};

export const getBookmark = query({
  args: {
    tweetId: v.string(),
    twitterUsername: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
      .query("bookmarked_tweets")
      .filter((q) =>
        q.and(
          q.eq(q.field("tweetBy.userName"), args.twitterUsername),
          q.eq(q.field("tweet.id"), args.tweetId)
        )
      )
      .first();

    const screenshotUrl = data?.storageId
      ? await ctx.storage.getUrl(data?.storageId)
      : null;

    return { ...data, screenshotUrl } as Tweet;
  },
});

export const isSystemUser = internalQuery({
  args: {
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("tags")
      .filter((q) => q.eq(q.field("twitter_tag"), args.userName))
      .first();

    return user;
  },
});

export const patchTweetRecord = internalMutation({
  args: {
    bookmarkId: v.id<"bookmarked_tweets">("bookmarked_tweets"),
    storageId: v.id("_storage"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookmarkId, {
      summary: args.summary,
      storageId: args.storageId,
    });
  },
});

export const processTweet = mutation({
  args: {
    thread_screenshot: v.string(),
    thread_md_summary: v.string(),

    // Screenshot urls
    twitterUrl: v.string(),
    xCancelTweetUrl: v.string(),

    // Original twitter metadata
    tweet: v.object({
      id: v.string(),
      url: v.string(),
      twitterUrl: v.string(),
      text: v.string(),
      createdAt: v.string(),
    }),

    tweetBy: v.object({
      id: v.string(),
      userName: v.string(),
      profile_bio: v.string(),
      profilePicture: v.string(),
    }),

    replyingTo: v.object({
      id: v.string(),
      userName: v.string(),
      replyId: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const systemUser = args.tweetBy.userName;
    const isValidUser = await ctx.runQuery(internal.bookmarks.isSystemUser, {
      userName: systemUser,
    });

    if (!isValidUser) {
      console.log(
        `Cannot bookmark this tweet, invalid user by @${args.tweetBy.userName}.`
      );
      return;
    }

    const tweetId = args.tweet.id;

    const tweet = await ctx.db
      .query("bookmarked_tweets")
      .filter((q) => q.eq(q.field("tweet.id"), tweetId))
      .first();

    if (tweet) {
      console.log(
        `Skipping tweet with id: ${args.tweet.id} since it aleady exists.`
      );
      return;
    }

    const bookmarkId = await ctx.db.insert("bookmarked_tweets", {
      tweet: args.tweet,
      tweetBy: args.tweetBy,
      twitterUrl: args.twitterUrl,
      replyingTo: args.replyingTo,
      xCancelTweetUrl: args.xCancelTweetUrl,
    });

    // Screenshot page and patch records.
    await ctx.scheduler.runAfter(0, api.screenshot.screenShotAndEmbed, {
      bookmarkId: bookmarkId,
      url: args.xCancelTweetUrl,
      originalText: args.tweet.text,
      twitterUsername: systemUser,
    });
  },
});

export const handleWebhook = mutation({
  args: {
    tweets: v.array(
      v.object({
        thread_screenshot: v.string(),
        thread_md_summary: v.string(),
        tweet: v.object({
          id: v.string(),
          url: v.string(),
          twitterUrl: v.string(),
          text: v.string(),
          createdAt: v.string(),
        }),
        tweetBy: v.object({
          id: v.string(),
          userName: v.string(),
          profilePicture: v.string(),
          profile_bio: v.string(),
        }),
        replyingTo: v.object({
          id: v.string(),
          userName: v.string(),
          replyId: v.string(),
        }),
        twitterUrl: v.string(),
        xCancelTweetUrl: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    console.log("Processing webhook requests. Amount: ", args.tweets.length);
    await Promise.all(
      args.tweets.map((item) =>
        ctx.runMutation(api.bookmarks.processTweet, item)
      )
    );
    console.log("Done!!!");
  },
});
