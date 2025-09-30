import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { action } from "./_generated/server";
import { authComponent } from "./auth";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbedding("gemini-embedding-001"),
  embeddingDimension: 3072,
});

type Entry = {
  entryId: string;
  filterValues: [];
  importance: number;
  metadata: {
    eventId: string;
    eventType: string;
  };
  status: string;
  text: string;
};

type Results = {
  answer: string | undefined;
  entries: Entry[];
};

export const ragAddContext = action({
  args: {
    text: v.string(),
    eventId: v.string(),
    twitterUsername: v.string(),
    eventType: v.union(
      v.literal("twitter_bookmark"),
      v.literal("scheduled_event")
    ),
  },
  handler: async (ctx, args) => {
    await rag.add(ctx, {
      namespace: `${args.eventType}|${args.twitterUsername}`,
      text: args.text,
      metadata: {
        eventId: args.eventId,
        eventType: args.eventType,
      },
    });
  },
});

export const ragSearch = action({
  args: {
    query: v.string(),
    eventType: v.union(
      v.literal("twitter_bookmark"),
      v.literal("scheduled_event")
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (user === null) {
      throw new Error("Not authenticated");
    }

    if (!user.twitterId) {
      throw new Error(
        "You have not associated your twitter id to use this feature."
      );
    }

    const { entries } = await rag.search(ctx, {
      namespace: `${args.eventType}|${user.twitterId}`,
      query: args.query,
      limit: 5,
      vectorScoreThreshold: 0.5,
    });

    return { entries, answer: undefined } as unknown as Results;
  },
});

export const askQuestion = action({
  args: {
    prompt: v.string(),
    eventType: v.union(
      v.literal("twitter_bookmark"),
      v.literal("scheduled_event")
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (user === null) {
      throw new Error("Not authenticated");
    }

    if (!user.twitterId) {
      throw new Error(
        "You have not associated your twitter id to use this feature."
      );
    }

    const { text, context } = await rag.generateText(ctx, {
      search: {
        namespace: `${args.eventType}|${user.twitterId}`,
        limit: 5,
      },
      prompt: args.prompt,
      model: google.chat("gemini-2.0-flash"),
      system: `You are an AI search assistant for Bookmarker, 
      a tool that improves bookmarking and search for Twitter 
      users by making it easy to find and explore bookmarked events. 
      Use the provided context to answer the user’s question 
      clearly and concisely. Respond only in plain text, without markdown. 
      If the answer is not in the context, do nothing.`,
    });

    return { answer: text, entries: context.entries } as unknown as Results;
  },
});
