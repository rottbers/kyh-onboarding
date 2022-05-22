# KYH Onboarding ✌️

An onboarding platform for KYH students.

## Development

This project is setup as a monorepo using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) containing two workspaces:

- `studio/` - the CMS built with [sanity studio](https://www.sanity.io/studio/)
- `web/` - the website built with [next.js](https://nextjs.org/)

This project also depends on one external service called [sanity](https://www.sanity.io/) which is a headless CMS used to store and query content (accessed server-side).

The general approach has been to make use of Incremental Static Regeneration (ISR) where possible for content to be static along with Client-Side Rendering (CSR) where content needs to be dynamic.

### Prerequisites

- [node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/) (`npm i -g yarn`)
- [sanity](https://www.sanity.io/) API credentials

### Get started

Create a `.env.local` file in `web/` and add the following environment variable along with its corresponding value:

```bash
SANITY_TOKEN = ""
```

Then use `yarn` to run available scripts e.g:

```bash
# installs dependencies
yarn

# starts next.js dev server on http://localhost:3000
yarn start:web

# starts sanity studio dev server on http://localhost:3333
# and is proxied via http://localhost:3000/studio (when start:web is running)
yarn start:studio

# starts both workspaces dev servers concurrently
yarn start
```

## Deployment

Project is currently hosted on [vercel](https://vercel.com/) and deploys through their github integration.

During build (`yarn build`) the static output for `studio/` is put among the static files for `web/` (in `public/studio/*`). This makes it easy to deploy both `studio/` and `web/` as a single project under the same domain.
