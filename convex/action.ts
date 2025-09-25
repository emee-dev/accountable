import { v } from "convex/values";
import { action } from "./_generated/server";
import retry from "async-retry";
import { internal } from "./_generated/api";

const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v2/scrape";
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const geminiToken = process.env.GEMINI_API_KEY;

export const screenShotPage = action({
  args: {
    recordId: v.id("bookmarks"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    if (!FIRECRAWL_API_KEY) {
      console.warn("Firecrawl api key is undefined!!!.");
      return;
    }

    const screenshot = await retry(
      async (_) => {
        const result = await callFireCrawl({
          FIRECRAWL_API_KEY,
          FIRECRAWL_ENDPOINT,
          url: args.url,
        });

        return result;
      },
      {
        retries: 3,
        onRetry(e, attempt) {
          console.log(
            `Trying to screenshot "${args.url}" again. Attempts: `,
            attempt
          );
        },
      }
    );

    await ctx.runMutation(internal.bookmarks.patchTweetRecord, {
      id: args.recordId,
      thread_screenshot: screenshot,
      thread_md_summary: "",
    });

    return screenshot;
  },
});

async function callFireCrawl(args: {
  url: string;
  FIRECRAWL_ENDPOINT: string;
  FIRECRAWL_API_KEY: string;
}) {
  const response = await fetch(args.FIRECRAWL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url: "https://docs.firecrawl.dev/",
      formats: [
        {
          type: "json",
          prompt: "Extract the company mission from the page.",
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid request, retrying");
  }

  const data = await response.json();

  console.log(`Screenshot for ${args.url}, Result:`, data);

  if (!data) {
    throw new Error("Unable to screenshot url");
  }

  return data;
}
