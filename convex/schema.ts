import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
    users: defineTable({
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        clerkId: v.string(),
    })
        .index("byName", ["name"])
        .index("byClerkId", ["clerkId"]),
});

export default schema;
