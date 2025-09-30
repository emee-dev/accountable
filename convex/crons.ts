import { cronJobs } from "convex/server";
import { components, internal } from "./_generated/api.js";
import { internalMutation } from "./_generated/server.js";

const crons = cronJobs();

crons.interval(
  "Delete old emails from the resend component",
  { hours: 5 },
  internal.crons.cleanupResend
);

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export const cleanupResend = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.scheduler.runAfter(0, components.resend.lib.cleanupOldEmails, {
      olderThan: THREE_DAYS_MS,
    });

    await ctx.scheduler.runAfter(
      0,
      components.resend.lib.cleanupAbandonedEmails,
      { olderThan: THREE_DAYS_MS }
    );

    console.log("Cleanup finished for emails older than 3 days");
  },
});

export default crons;
