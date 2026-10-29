# Demo Web Shop – Wishlist to Cart (Playwright)

End-to-end test automation for [Tricentis Demo Web Shop](https://demowebshop.tricentis.com) built with [Playwright](https://playwright.dev) and TypeScript, using the Page Object Model.

## Scenario covered

`tests/wishlistToCart.spec.ts` runs a single journey:

1. Register a new user with a unique, generated email
2. Search for "Book" and add two products to the wishlist
3. Verify both products appear in the wishlist
4. Move both products from the wishlist to the cart
5. Verify the cart subtotal matches the sum of the unit prices
6. Apply an invalid coupon and verify the error message

## Project structure

```
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json
├── src
│   ├── pages                 # Page objects (header, register, search, category,
│   │                         #   product, wishlist, cart)
│   └── utils
│       ├── logger.ts         # Step logging helper
│       └── testData.ts       # Unique user generation
└── tests
    └── wishlistToCart.spec.ts
```

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npx playwright install
```

## Running the tests

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `npm test`           | Run tests headless                         |
| `npm run test:headed`| Run tests in a visible browser             |
| `npm run report`     | Open the last HTML report                  |
| `npm run typecheck`  | Type-check the project with `tsc --noEmit` |

## Configuration

| Variable   | Default                                | Purpose                      |
| ---------- | -------------------------------------- | ---------------------------- |
| `BASE_URL` | `https://demowebshop.tricentis.com`    | Site under test              |
| `HEADED`   | unset                                  | Set to `1` to show the browser |

Example:

```bash
BASE_URL=https://demowebshop.tricentis.com HEADED=1 npx playwright test
```

Test settings: 90s test timeout, 1 retry, HTML + list reporters, and traces/screenshots retained on failure.
