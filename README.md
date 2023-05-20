# JURUMI

Jurumi is a web platform created to manage non-profit's projects, keep track of expenses and soon memberships.

## Why Jurumi?

As software developers we often don't realize the impact we can have across a multitude of fields. Structuring and organizing processes frees employees and volunteers from organizations to spend their concentrating in the matters at hand. This software aims to simplify processes and structure teams.

Paaraguay being so small and having such different needs as other countries, lacks similar offerings in the market, having not found a solution that fits the needs local organizations have and pays enough attention to the problems we're trying to solve locally we (OPADES) decided to build Jurumi.

## Who's behind Jurumi?

Jurumi became a reality thanks to funding provided by [OPADES](https:///opades.org.py). We're open source this project so that anyone interested can get involve.

## How can I help?

If you just want to clone the project and try it out there are instructions below. You can always refer to the [DOCS](https://docs.opades.org.py) for more info. If you're interested in helping with the code please reach out through this email: tjara@opades.org.py and I'll personally show you how everything works.

## Tech stack

Jurumi is built in NextJS, which uses react and Typescript. It uses Prisma as it's orm and Trpc to handle api routes. Images are stored in Azure's blob storage. I recommend PostgreSQL for database but you can use any database you choose, Prisma will smooth out the bumps.
Firebase is used for push notifications to the browser, Sendgrid for email notifications and you can also add Slack for a few notifications like money requests and approvals.

The OCR capability can be obtained through deploying a different repo which has a NestJs app, and connecting it through the environment variables. I will be open sourcing that repo soon.

You can also hookup open-replay for session replays.

**Side note**: The reasoning behind picking Azure is that Microsoft offers a very generous grant to non-profits. So if your organization lacks the funds to use all the capabilities Jurumi offers, an option could be to apply for Microsoft's non-profit program.

## Getting started

Create a .env file and copy the contents from the .env.example . Must have variables other than the ones that are already filled in are:

- DATABASE_URL

Sync your db with the local schema:

```
npx prisma db push
```

Kindly, use pnpm.

```
pnpm dev
```

Go to te url: http://localhost:3000/setup to create the first admin account.
