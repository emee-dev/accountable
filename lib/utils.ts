import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTweetHead = (props: { url: string; inReplyToId: string }) => {
  const matchedTweetUrl = props.url;
  const replyingTo = props.inReplyToId;

  // Step 1: swap domain from x.com → xcancel.com
  const updatedUrl = matchedTweetUrl.replace("x.com", "xcancel.com");

  // Step 2: replace the trailing numeric tweet ID with the inReplyToId
  const finalUrl = updatedUrl.replace(/\/\d+$/, `/${replyingTo}`);

  return finalUrl;
};

export const isProd = process.env.NODE_ENV === "production";
