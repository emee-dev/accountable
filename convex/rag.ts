import { components } from "./_generated/api";
import { RAG } from "@convex-dev/rag";
import { google } from "@ai-sdk/google";
import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { doc } from "convex-helpers/validators";
import schema from "./schema";

const rag = new RAG(components.rag, {
  textEmbeddingModel: google.textEmbedding("gemini-embedding-001"),
  embeddingDimension: 1536, // Needs to match your embedding model
});

export const ragAddContext = action({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    await rag.add(ctx, {
      namespace: "all-users",
      text,
    });
  },
});

export const ragSearch = action({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const { results, text, entries, usage } = await rag.search(ctx, {
      namespace: "global",
      query: args.query,
      limit: 5,
      vectorScoreThreshold: 0.5,
    });

    return { results, text, entries, usage };
  },
});

// export const getCurrentUser = query({
//     args: {},
//     returns: v.union(v.null(), doc(schema, "user")),
//     handler: async (ctx) => {
//       const identity = await ctx.auth.getUserIdentity();
//       if (!identity) {
//         return null;
//       }
//       return await ctx.db.get(identity.subject as Id<"user">);
//     },
//   });

export const askQuestion = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    // const user = await ctx..get(identity.subject as Id<"user">);

    // console.log("Identity: ", identity);

    const { text, context } = await rag.generateText(ctx, {
      search: { namespace: "userId", limit: 10 },
      prompt: args.prompt,
      model: google.chat("gemini-1.5-pro"),
    });
    return { answer: text, context };
  },
});
