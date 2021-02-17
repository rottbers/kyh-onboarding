# KYH Onboarding

This project is setup as a monorepo using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) containing two workspaces:

- `studio/` - the CMS built with [sanity studio](https://www.sanity.io/)
- `web/` - the website built with [next.js](https://nextjs.org/)

## Development

> 🚧 project is currently under development.. expect quirks 🚧

### Requirements

- [node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/) (`npm i -g yarn`)
- [firebase](https://firebase.google.com/) & [sanity](https://www.sanity.io) API credentials

### Get started

```bash
# create web/.env.local

SANITY_TOKEN=""

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

```bash
# install dependencies
yarn

# starts next.js dev server on http://localhost:3000
yarn start:web

# starts sanity studio dev server on http://localhost:3333
# and is proxied via http://localhost:3000/studio (when start:web is running)
yarn start:studio
```
