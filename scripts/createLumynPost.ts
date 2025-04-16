import { withTracing } from "@posthog/ai";
import { generateText } from "ai";
import { addDays } from "date-fns";

import { db, glanceArticles } from "@/db";
import { deepseek } from "@/lib/ai/deepseek";
import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";
import { getGenericTransits } from "@/lib/astrology/getGenericTransits";

const dayToString = (day: number) => {
    switch (day) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
    }
};

const currentWeekDay = new Date().getDay(); // remember this starts at 0 for sunday

const currentDate = new Date();
const startOfWeekDate = new Date(currentDate);

if (currentWeekDay === 0) {
    startOfWeekDate.setDate(currentDate.getDate() - 6);
} else {
    startOfWeekDate.setDate(currentDate.getDate() - currentWeekDay + 1);
}

const existingPost = await db.query.glanceArticles.findFirst({
    where: (glanceArticles, { eq, and }) =>
        and(eq(glanceArticles.createdAt, startOfWeekDate)),
});

if (existingPost) {
    console.error("Post already exists for this week");
    process.exit(1);
}

const lastWeekDate = addDays(startOfWeekDate, -7);

const lastWeekPost = await db.query.glanceArticles.findFirst({
    where: (glanceArticles, { eq }) =>
        eq(glanceArticles.createdAt, lastWeekDate),
});

const systemPrompt =
    "You are tasked with writing a comprehensive blog post about a week in astrology. You are not provided with any data specific to a user, rather generic transit data that applies to the whole planet. You will be given a transit chart of this format, one for each day. You will need to write a blog post that explains the charts combined into one week and their significance. You will need to provide a summary of the week and how the transits may affect people in general at the end. You can github-flavoured markdown. Do not use emojis. Try and keep it simple so beginners can understand, but still be comprehensive and don't miss any details. The longer the better. You may be provided with your blog post from last week, but ignore it if it's unavailable. You may make references to last week if available. The article you write will be displayed on a blogging site, so don't provide any writing other than the blog post its self. You should write in a conversational format, a proper blog post. Don't create a heading for each day, instead provide a continuous streams of astrological events in multiple paragraphs. Should be slightly formal, but more emphasis on the conversational and friendly tone. Keep bullet points to a minimum. Almost think of this blog post like an informal report with a minumum word count.";

let weekTransitPrompt = "";

weekTransitPrompt += `# Week of ${startOfWeekDate.toLocaleDateString()}\n\n`;

weekTransitPrompt += "## Last Week's Summary\n\n";

if (lastWeekPost) {
    weekTransitPrompt += "```md" + lastWeekPost.content + "```\n\n";
} else {
    weekTransitPrompt += `Last week's summary is not available.\n\n`;
}

weekTransitPrompt += `## This Week's Transits\n\n`;

for (let i = 0; i < 7; i++) {
    const transitDate = addDays(startOfWeekDate, i);

    const chart = await getGenericTransits({
        date: transitDate,
    });

    weekTransitPrompt += `### ${dayToString(transitDate.getDay())} ${transitDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        },
    )}\n`;

    weekTransitPrompt += `\`\`\`json\n${JSON.stringify(chart)}\n\`\`\`\n\n`;
}

const posthog = getPostHogNodeClient();

const { text: summary } = await generateText({
    model: withTracing(deepseek("deepseek-chat"), posthog, {
        posthogDistinctId: "lumyn",
        posthogProperties: {
            type: "weekly_glance",
            for_date: startOfWeekDate.toISOString(),
        },
    }),
    temperature: 1.0,
    system: systemPrompt,
    prompt: weekTransitPrompt,
});

console.log(summary);

await db
    .insert(glanceArticles)
    .values({
        title: `Weekly Astrology Glance - ${startOfWeekDate.toLocaleDateString()}`,
        content: summary,
        createdAt: startOfWeekDate,
        updatedAt: startOfWeekDate,
    })
    .returning();
