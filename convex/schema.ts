import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  settings: defineTable({
    userId: v.string(),
    userName: v.string(),
  }),
  bookmarks: defineTable({
    userId: v.string(),
    screenshot_url: v.string(),
    mention_tweet_url: v.string(),
    mention_tweet_id: v.string(),
    mention_tweet_text: v.string(),
    embedded_tweet_head: v.string(),
  }),
});

export default schema;
