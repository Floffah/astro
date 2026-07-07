// convex/convex.config.ts
import workpool from "@convex-dev/workpool/convex.config.js";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(workpool, { name: "genWorkpool" });
export default app;
