## Get started (local development)

### Myko app

1. `npm install`
1. `npm run dev`

### Sanity studio

1. `npm install`
1. Install [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli).
1. `sanity start`

## Features

- Uses [SvelteKit](https://kit.svelte.dev) for frontend
  - `.editorconfig` for code style together with `prettier` (`npm run format`)
  - Supports images via [`image-url`](https://www.sanity.io/docs/image-url)
- Uses Sanity.io as CMS

## TODO

- Login via Auth0 with user data sync to Sanity.io
- Ability to register for activity events - can only change event registration for currently logged-in user
- Storage of completed events - both for auditing and art visualization effects
- Fix testing setup
  - Setup CI pipelines via Github Actions - automatic linting and testing
  - Use [Playwright](https://playwright.dev)?
- Write proper Svelte components
  - Support [image cropping](https://github.com/sanity-io/sanity-template-svelte-kit/blob/9a226241ec72f20ae62c8d6a0a393948186b94e8/src/lib/SanityImage.svelte)?
  - Format dates, e.g. event dates
- Add styling (Tailwind CSS?)
- Figure out handling of "instant" events
- Revise Sanity.io schemas
- Add LICENSE to code
