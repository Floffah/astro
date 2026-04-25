import { defineSchema, defineTable } from "convex/server";
import { VAny, v } from "convex/values";

import { SchemaCalculateBirthChartResponse } from "@/types/apis/astrocalc";

const schema = defineSchema({
    users: defineTable({
        name: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        clerkId: v.string(),
        birthData: v.optional(
            v.object({
                birthday: v.string(),
                latitude: v.number(),
                longitude: v.number(),
            }),
        ),
        birthChart: v.optional(
            v.any() as VAny<SchemaCalculateBirthChartResponse>,
        ),
    })
        .index("byName", ["name"])
        .index("byClerkId", ["clerkId"]),
});

export default schema;
