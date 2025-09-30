import retry from "async-retry";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

export interface ScrapeResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  screenshot: string;
  metadata: Metadata;
  json: Json;
}

export interface Metadata {
  title: string;
  "og:title": string;
  ogImage: string;
  ogSiteName: string;
  "og:type": string;
  "og:description": string;
  viewport: string;
  "og:site_name": string;
  "og:locale": string;
  "theme-color": string;
  ogTitle: string;
  "twitter:image:src": string[];
  language: string;
  favicon: string;
  ogLocale: string;
  "og:image": string[];
  ogDescription: string;
  "twitter:card": string[];
  scrapeId: string;
  sourceURL: string;
  url: string;
  statusCode: number;
  contentType: string;
  proxyUsed: string;
  creditsUsed: number;
}

export interface Json {
  summary: string;
}

async function callFireCrawl(args: { screenShotUrl: string }) {
  const FIRECRAWL_ENDPOINT = "https://api.firecrawl.dev/v2/scrape";
  const response = await fetch(FIRECRAWL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url: args.screenShotUrl,
      waitFor: 1000,
      formats: [
        {
          type: "json",
          prompt: `Provide a brief paragraph plain text summary of the page content. 
          No markdown. Do nothing if you do not know. 
          It should match the structure of the schema I have provided. 
          Nothing more or less, just exactly the schema.`,
          // Zod schema did not work for me.
          // Defaulting to json schema
          schema: {
            properties: {
              summary: {
                description: "Summary of page content",
                type: "string",
              },
            },
            required: ["summary"],
            type: "object",
          },
        },
        {
          type: "screenshot",
          fullPage: true,
          quality: 90,
          viewport: {
            height: 682,
            width: 1272,
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid request, retrying");
  }

  const data = (await response.json()) as ScrapeResponse;

  console.log(`Screenshot for ${args.screenShotUrl}, Result:`, data);

  if (!data) {
    throw new Error("Unable to screenshot url");
  }

  return data;
}

export const screenShotAndEmbed = action({
  args: {
    url: v.string(),
    originalText: v.string(),
    twitterUsername: v.string(),
    bookmarkId: v.id("bookmarked_tweets"),
  },
  handler: async (ctx, args) => {
    if (!FIRECRAWL_API_KEY) {
      throw new Error("Firecrawl api key is undefined!!!.");
    }

    const scrapeData = await retry(
      async (_) => {
        const result = await callFireCrawl({
          screenShotUrl: args.url,
        });

        return {
          screenshot: result.data.screenshot,
          summary: result.data?.json?.summary || "",
          pageTitle: result.data.metadata.title,
        };
      },
      {
        retries: 3,
        onRetry(e, attempt) {
          console.log(
            `Trying to screenshot "${args.url}" again. Attempts: ${attempt}`
          );
        },
      }
    );

    const storageId = await retry(
      async (_) => {
        const response = await fetch(scrapeData.screenshot);
        const image = await response.blob();

        const storageId: Id<"_storage"> = await ctx.storage.store(image);

        return storageId;
      },
      {
        retries: 3,
        onRetry(e, attempt) {
          console.log(
            `Attempting to store screenshot: "${args.url}" again. Attempts: ${attempt}`
          );
        },
      }
    );

    const summary = scrapeData.summary;
    const bookmarkId = args.bookmarkId;

    await Promise.all([
      // Update records
      ctx.runMutation(internal.bookmarks.patchTweetRecord, {
        summary,
        storageId,
        bookmarkId,
      }),

      // Embed tweet contents
      ctx.runAction(api.rag.ragAddContext, {
        eventId: bookmarkId,
        eventType: "twitter_bookmark",
        text: `[Tweet]
    User: @${args.twitterUsername}
    Original text: ${args.originalText}
    ${summary ? `Summary: ${scrapeData.summary}` : ""}
    Source: ${args.url}`,
        twitterUsername: args.twitterUsername,
      }),
    ]);
  },
});
