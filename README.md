# Astro by Floffah

A small Next.js app for saving birth details, calculating natal charts through
Astrocalc, and building a daily astrology view around the saved chart.

## Local Development

```bash
bun dev
```

The app expects Clerk and Convex env vars. Convex also needs
`CLERK_USERS_WEBHOOK_SIGNING_SECRET` and `CLERK_SECRET_KEY`.

Useful commands:

```bash
bun run lint
bun run build
bun run codegen
```

`bun dev` runs the frontend and Convex backend through Turbo.
