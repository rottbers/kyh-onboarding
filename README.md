# KYH Onboarding ✌️

This project is setup as a monorepo using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) containing two workspaces:

- `studio/` - the CMS built with [sanity studio](https://www.sanity.io/)
- `web/` - the website built with [next.js](https://nextjs.org/)

## Development

...

### Prerequisites

- [node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/) (`npm i -g yarn`)
- [firebase](https://firebase.google.com/) & [sanity](https://www.sanity.io) API credentials

### Get started

Create a `.env.local` file in `web/` and add the following environment variables along with their corresponding values:

```bash
SANITY_TOKEN = ""
NEXT_PUBLIC_FIREBASE_API_KEY = ""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = ""
NEXT_PUBLIC_FIREBASE_PROJECT_ID = ""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = ""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = ""
NEXT_PUBLIC_FIREBASE_APP_ID = ""
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
