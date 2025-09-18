import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// You can get the current user from the auth component
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx);
  },
});

export const handle = mutation({
  args: {},
  handler: async (ctx, args) => {},
});

export const newBookmark = mutation({
  args: {},
  handler: async (ctx, args) => {},
});
