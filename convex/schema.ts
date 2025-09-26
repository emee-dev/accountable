import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  tags: defineTable({
    userId: v.string(),
    twitter_tag: v.string(),
  }),

  bookmarks: defineTable({
    thread_screenshot: v.optional(v.string()),
    thread_md_summary: v.optional(v.string()),

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
  }),
});

export default schema;
