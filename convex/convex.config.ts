import rag from "@convex-dev/rag/convex.config";
import resend from "@convex-dev/resend/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(rag);
app.use(resend);

export default app;
