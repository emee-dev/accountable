import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const listGists = query({
  args: {
    date: v.string(),
    twitterId: v.string(),
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
      .query("gists")
      .filter((q) =>
        q.and(
          q.eq(q.field("twitterId"), args.twitterId),
          q.gte(q.field("_creationTime"), dayStart),
          q.lte(q.field("_creationTime"), dayEnd)
        )
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const newGist = mutation({
  args: {
    label: v.string(),
    description: v.string(),
    twitterId: v.string(),
    email_blast: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("gists", {
      label: args.label,
      description: args.description,
      twitterId: args.twitterId,
      email_blast: args.email_blast,
    });

    // Blast email to participants
  },
});

export const deleteGist = mutation({
  args: {
    id: v.id("gists"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
