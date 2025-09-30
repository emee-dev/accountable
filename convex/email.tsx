import { Resend, vOnEmailEventArgs } from "@convex-dev/resend";
import { render } from "@react-email/components";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";
import ResetPasswordEmail from "./emails/PasswordResetEmail";
import "./polyfills";

export const resend: Resend = new Resend(components.resend, {
  testMode: false,
  apiKey: process.env.RESEND_API_KEY,
  onEmailEvent: internal.email.handleEmailEvent,
});

export const handleEmailEvent = internalMutation({
  args: vOnEmailEventArgs,
  handler: async (ctx, args) => {
    const { id, event } = args;
    console.log("📩 Resend webhook received:", id, event.type);

    const testEmail = await ctx.db
      .query("sent_emails")
      .withIndex("by_email", (q) => q.eq("email", id))
      .unique();

    if (!testEmail) {
      console.warn("⚠️ No sent email found for id:", id);
      return;
    }

    const expectedByEvent: Record<
      string,
      "delivered" | "bounced" | "complained"
    > = {
      "email.delivered": "delivered",
      "email.bounced": "bounced",
      "email.complained": "complained",
    };

    const actual = event.type;
    const expected = expectedByEvent[actual];

    if (!expected) {
      console.warn("⚠️ Unknown event type:", actual);
      return;
    }

    // Special case: delivered but expectation is "complained"
    if (
      actual === "email.delivered" &&
      testEmail.expectation === "complained"
    ) {
      console.log("📨 Delivered email, but expecting complaint later...");
      return;
    }

    if (testEmail.expectation !== expected) {
      throw new Error(
        `❌ Mismatch for ${id}: got ${actual}, expected ${testEmail.expectation}`
      );
    }

    console.log(`✅ ${actual} matched expectation (${expected}) for ${id}`);
    await ctx.db.delete(testEmail._id);
  },
});

export const sendResetPassword = action({
  args: {
    to: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const email = await resend.sendEmail(ctx, {
      from: "Bookmarkio <events@bmcd.store>",
      to: args.to,
      subject: "Reset your password",
      html: await render(<ResetPasswordEmail url={args.url} />),
    });

    console.log("Email sent", email);
    let status = await resend.status(ctx, email);
    while (
      status &&
      (status.status === "queued" || status.status === "waiting")
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      status = await resend.status(ctx, email);
    }
    console.log("Email status", status);
    return email;
  },
});
