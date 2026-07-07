import { defineSchema, defineTable } from "convex/server";
import { VAny, v } from "convex/values";

import {
    SchemaCalculateBirthChartResponse,
    SchemaCalculateTransitRangeResponse,
} from "@/types/apis/astrocalc";

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

        weekTransitChartLastCalculated: v.optional(v.number()),
        weekTransitChart: v.optional(
            v.any() as VAny<SchemaCalculateTransitRangeResponse>,
        ),
        weekReadingKey: v.optional(v.string()),
        weekReadingsGenerationId: v.optional(v.string()),
        weekReadingsStartedAt: v.optional(v.number()),
        weekReadingsError: v.optional(v.string()),
        weekReadingErrors: v.optional(
            v.object({
                overall: v.optional(v.string()),
                love: v.optional(v.string()),
                work: v.optional(v.string()),
                family: v.optional(v.string()),
                friends: v.optional(v.string()),
            }),
        ),
        overallReading: v.optional(v.string()),
        loveReading: v.optional(v.string()),
        workReading: v.optional(v.string()),
        familyReading: v.optional(v.string()),
        friendsReading: v.optional(v.string()),
    })
        .index("byName", ["name"])
        .index("byClerkId", ["clerkId"]),
});

export default schema;
