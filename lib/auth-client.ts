import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [convexClient()],
});
