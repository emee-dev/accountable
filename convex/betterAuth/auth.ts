import { createAuth } from "../auth";
import { getStaticAuth } from "@convex-dev/better-auth";

// Export a static instance for Better Auth schema generation
export const auth = getStaticAuth(createAuth);
// auth.api.updateUser({
//   body: {
//     // @ts-expect-error - I don't know why it is not inferred
//     twitterId: "",
//   },
// });
