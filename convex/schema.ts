import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  sent_emails: defineTable({
    email: v.string(),
    expectation: v.union(
      v.literal("delivered"),
      v.literal("bounced"),
      v.literal("complained")
    ),
  }).index("by_email", ["email"]),
  tags: defineTable({
    userId: v.string(),
    twitter_tag: v.string(),
  }),

  notifications: defineTable({
    email: v.string(),
    events: v.array(
      v.object({
        label: v.string(),
        date: v.string(),
      })
    ),
  }),

  bookmarked_tweets: defineTable({
    storageId: v.optional(v.id<"_storage">("_storage")),
    summary: v.optional(v.string()),

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

  gists: defineTable({
    twitterId: v.string(),
    label: v.string(),
    description: v.string(),
    email_blast: v.optional(v.array(v.string())),
  }),
});

export default schema;
