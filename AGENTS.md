## Rules

- When creating placeholder content, this should be treated as a proof of concept. or something that resembles future work (even if small). Do not create placeholder content that reads like "your xyz will be here soon".
- Copy and prose should never reflect an in-development state. You should never note in the application that something is missing or coming soon.
- Don't run a full build (next + convex) **or run a dev server** unless the user specifically asks you to by stating something like "run a build" or "test your work". That said, linting (`bun run lint`) and testing (`bun run test`, if test files exist) should be ran on every change.

## Human Writing Policy

This repository prioritises writing that sounds like it was written by a knowledgeable human being with a purpose, not by a language model attempting to satisfy a prompt.

The goal is not to hide AI usage. The goal is to produce writing that is useful, concise, specific, and natural. If using an LLM, treat its output as a rough draft requiring substantial editing.

This document is informed by observed patterns of AI-generated writing documented by Wikipedia editors and professional writers.

⸻

Core Principle

Before writing anything, ask:

“Would an experienced human naturally choose to write this exact sentence?”

If the answer is “probably not”, rewrite it.

Prefer:

* specificity over generality
* observation over explanation
* examples over abstractions
* confidence over hedging
* brevity over completeness
* substance over structure

⸻

DO NOT WRITE TO FILL SPACE

AI models are rewarded for producing complete-looking answers, even when the additional text provides little value.

Avoid:

* restating the question
* summarising what was just said
* adding transition paragraphs that communicate nothing
* writing introductions and conclusions solely because they are expected
* producing exhaustive lists when a few examples suffice

Bad:

Databases are an important component of modern software systems. They play a crucial role in storing, retrieving, and managing data efficiently.

Better:

This service stores session state in PostgreSQL.

⸻

DO NOT MANUFACTURE IMPORTANCE

AI frequently attempts to make ordinary topics sound profound.

Avoid phrases like:

* “It is important to note”
* “It is worth mentioning”
* “Crucially”
* “Significantly”
* “Notably”
* “Remarkably”
* “A testament to”
* “Underscores”
* “Highlights”
* “Demonstrates the importance of”
* “No discussion would be complete without”

Do not artificially connect topics to:

* humanity
* society
* culture
* innovation
* progress
* the future
* broader implications

Bad:

This feature underscores the evolving landscape of modern computing.

Better:

This feature reduces memory usage by about 30%.

⸻

AVOID GENERIC AI VOCABULARY

Avoid words that frequently appear because they sound sophisticated rather than because they are the best choice.

Examples include:

* delve
* intricate
* tapestry
* landscape
* paradigm
* transformative
* robust
* leverage
* facilitate
* foster
* pivotal
* enhance
* seamless
* comprehensive
* dynamic
* multifaceted
* nuanced
* compelling
* groundbreaking

Use ordinary words instead.

Bad:

This robust framework facilitates a seamless development experience.

Better:

This framework makes development easier.

⸻

DO NOT USE “MARKETING ENGLISH”

Avoid promotional or tourism-brochure language.

Never describe things as:

* breathtaking
* stunning
* vibrant
* world-class
* revolutionary
* transformative
* cutting-edge
* state-of-the-art
* unique
* unparalleled
* exceptional

Describe what something actually is.

Bad:

Haven is a vibrant and breathtaking cityscape.

Better:

Haven is a dense pedestrian city with extensive public transport.

⸻

AVOID FALSE CONTRASTS

AI frequently invents rhetorical contrasts that communicate little.

Avoid patterns like:

* “It’s not X, it’s Y”
* “More than just…”
* “Not merely…, but…”
* “Rather than…, instead…”
* “Beyond being…”

Bad:

This isn’t just a transport system; it’s a statement about human connection.

Better:

The transport system prioritises pedestrians over private vehicles.

⸻

AVOID FAKE SPECTRA AND FALSE RANGES

Do not write:

* “from X to Y”
* “whether A or B”
* “ranging from”
* “spanning everything from”

unless there is an actual spectrum.

Bad:

The platform supports everyone from hobbyists to enterprise customers.

Better:

The platform is used by hobbyists and some businesses.

⸻

AVOID THE RULE OF THREE

AI strongly prefers lists of three.

Examples:

* “fast, efficient, and scalable”
* “simple, elegant, and powerful”
* “innovative, transformative, and groundbreaking”

Use the number of items actually required.

Bad:

The API is simple, powerful, and flexible.

Better:

The API is simple.

⸻

DO NOT OVERUSE EMPHASIS

Avoid:

* excessive bolding
* excessive bullet lists
* excessive headings
* em-dash overuse
* nested lists
* formatting that resembles a slide deck

If a sentence requires formatting to be understandable, rewrite the sentence.

Prefer prose.

⸻

DO NOT WRITE LIKE AN ESSAY

AI frequently generates school-essay structure:

1. Introduction
2. Explanation
3. Summary
4. Conclusion

Most writing does not need this structure.

Avoid:

* “In summary”
* “In conclusion”
* “Overall”
* “To summarise”
* “Ultimately”
* “In essence”

Simply stop writing when the point has been made.

⸻

DO NOT HEDGE EXCESSIVELY

Avoid:

* “generally”
* “typically”
* “often”
* “commonly”
* “arguably”
* “somewhat”
* “relatively”
* “potentially”
* “may”
* “might”
* “could”
* “can be seen as”

unless uncertainty is genuinely important.

Bad:

This approach can often potentially improve performance.

Better:

This approach improves performance when database latency dominates.

⸻

PREFER CONCRETE DETAILS

Whenever possible, replace abstractions with:

* names
* numbers
* measurements
* examples
* anecdotes
* observations

Bad:

The city has advanced transportation infrastructure.

Better:

Most journeys within Haven take place by tram, metro, or walking.

⸻

PRESERVE HUMAN IMPERFECTION

Human writing often contains:

* uneven sentence lengths
* personal preferences
* minor stylistic inconsistencies
* unexpected examples
* strong opinions
* occasional informality

Do not optimise these away.

A paragraph that feels slightly idiosyncratic is usually preferable to one that feels machine-optimised.

⸻

REMOVE “AI TRANSITIONS”

Delete transitions that exist only because they sound good:

* “Additionally”
* “Furthermore”
* “Moreover”
* “On the other hand”
* “That being said”
* “With that in mind”
* “In this context”
* “As such”
* “Consequently”

If two sentences connect naturally, place them next to each other.

⸻

DO NOT EXPLAIN THE OBVIOUS

Assume the reader is intelligent.

Avoid:

* defining common concepts
* explaining your own reasoning process
* restating facts in different words
* narrating what you are about to explain

Bad:

Before discussing databases, it is important to understand what a database is.

Better:

PostgreSQL stores the application state.

⸻

FINAL CHECKLIST

Before submitting any text, verify:

* Does this sentence communicate new information?
* Could a human have written this naturally?
* Am I trying to sound smart?
* Am I trying to sound complete?
* Am I trying to sound profound?
* Am I repeating myself?
* Can I replace abstraction with specifics?
* Can I delete this sentence entirely?

If deleting a sentence does not make the document worse, delete it.

## Tools

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
