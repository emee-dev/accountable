import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { api, components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { ActionCtx, mutation, query } from "./_generated/server";
import authSchema from "./betterAuth/schema";
import { v } from "convex/values";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  }
);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly }: { optionsOnly?: boolean } = { optionsOnly: false }
) => {
  return betterAuth({
    logger: {
      disabled: optionsOnly,
    },
    baseUrl: siteUrl,
    database: authComponent.adapter(ctx),
    account: {
      accountLinking: {
        enabled: true,
        allowDifferentEmails: true,
      },
    },
    user: {
      additionalFields: {
        twitterId: {
          type: "string",
          required: false,
          unique: true,
        },
      },
      deleteUser: {
        enabled: true,
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await (ctx as ActionCtx).scheduler.runAfter(
          0,
          api.email.sendResetPassword,
          { to: user.email, url }
        );
      },
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },
    plugins: [anonymous(), convex()],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

export const updateUserTwitterId = mutation({
  args: {
    twitterId: v.string(),
  },
  handler: async (ctx, args) => {
    const status = await createAuth(ctx).api.updateUser({
      body: {
        twitterId: args.twitterId,
      },
      headers: await authComponent.getHeaders(ctx),
    });

    return status;
  },
});
