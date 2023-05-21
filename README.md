# JURUMI

Jurumi is a web platform created to manage non-profit's projects, keep track of expenses and soon memberships.

## Why Jurumi?

As software developers we often don't realize the impact we can have across multitude of fields. Structuring and organizing processes, frees employees and volunteers so they can spend their time focusing on more important matters. This software aims to simplify processes and structure teams.

Paraguay being so small and having such different needs as other countries, lacks similar offerings in the market, having not found a solution that fits the needs local organizations have, and pays enough attention to the problems we're trying to solve locally we (OPADES) decided to build Jurumi.

## Who's behind Jurumi?

Jurumi became a reality thanks to funding provided by [OPADES](https:///opades.org.py). We're open sourcing this project so that anyone interested can get involved.

## How can I help?

To run the project, getting started instructions can be found below. Anyone can submit code through pull requests, for detailed information on how to contribute please reach out through this email: tjara@opades.org.py and I'll personally show you how everything works.

## Tech stack

Jurumi is built in NextJS, which uses react and Typescript. It uses Prisma as it's orm, and Trpc to handle api routes. Images are stored in Azure's blob storage. I recommend PostgreSQL for database but you can use any database you choose, Prisma will smooth out the bumps.

Firebase is used for push notifications to the browser, Sendgrid for email notifications and you can also add Slack for a few notifications like money requests and approvals.

The OCR capability can be obtained through deploying a different repo which has a NestJs app, and connecting it through the environment variables. I will be open sourcing that repo soon.

Open-replay is available for session replays.

**Side note**: The reasoning behind picking Azure is that Microsoft offers a very generous grant to non-profits. So if any organization interested lacks the funds to use all the capabilities Jurumi offers, an option could be to apply for Microsoft's non-profit program.

#### Minimum requirements:

- <a href="https://pnpm.io/installation" target="_blank">Pnpm</a>
- <a href="https://www.docker.com/products/docker-desktop/" target="_blank">Docker</a>

## Getting started

Create a .env file and copy the contents from the .env.example . Must have variables other than the ones that are already filled in are:

- DATABASE_URL

Install packages (Kindly use pnpm)

```
cp .env.example .env

pnpm i
```

Load the environment

```
docker compose up
```

Sync your db with the local schema:

```
npx prisma db push
```

Run the project

```
pnpm dev
```

Go to the url: http://localhost:3000/setup to create the first admin account.

- Login with your new credentials

- Edit your default organization clicking on the "Organización" menu

- Add a Money Account From "Cuentas"

#### Use the seed button for testing and quickly filling out forms

For further information about how the app works please visit the <a href="https://docs.opades.org.py" target="_blank">Docs</a>

### Todo

- [ ] Setup Azurite for blob storage locally.
- [ ] Finish memberships component
- [ ] Attach OCR repo and integrate easily for local development.
