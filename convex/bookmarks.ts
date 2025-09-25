import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { authComponent } from "./auth";
import { fetchAction } from "convex/nextjs";
import { api, internal } from "./_generated/api";

// You can get the current user from the auth component
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
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
    id: v.id<"bookmarks">("bookmarks"),
    thread_screenshot: v.string(),
    thread_md_summary: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      thread_md_summary: args.thread_md_summary,
      thread_screenshot: args.thread_screenshot,
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
    const isValidUser = await ctx.runQuery(internal.bookmarks.isSystemUser, {
      userName: args.tweetBy.userName,
    });

    if (!isValidUser) {
      console.log(
        `@${args.tweetBy.userName} is not registered for monitoring.`
      );
      return;
    }

    const tweet = await ctx.db
      .query("bookmarks")
      .filter((q) => q.eq(q.field("tweet.id"), args.tweet.id))
      .first();

    if (tweet) {
      console.log(
        `Skipping tweet with id: ${args.tweet.id} since it aleady exists.`
      );
      return;
    }

    // const screenshot = await fetchAction(api.action.screenShotPage, {
    //   url: args.xCancelTweetUrl,
    // });

    const recordId = await ctx.db.insert("bookmarks", {
      // thread_md_summary: "",
      // thread_screenshot: screenshot,
      tweet: args.tweet,
      tweetBy: args.tweetBy,
      twitterUrl: args.twitterUrl,
      replyingTo: args.replyingTo,
      xCancelTweetUrl: args.xCancelTweetUrl,
    });

    await ctx.scheduler.runAfter(0, api.action.screenShotPage, {
      recordId: recordId,
      url: args.xCancelTweetUrl,
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
