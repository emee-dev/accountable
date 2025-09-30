import type { auth } from "@/convex/betterAuth/auth";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import {
  anonymousClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>({
      twitterId: {
        type: "string",
        required: false,
        unique: true,
      },
    }),
    anonymousClient(),
    convexClient(),
  ],
});
