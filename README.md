# Wishlist to Cart Validation (Scenario 5)

End-to-end automation of https://demowebshop.tricentis.com/ : register, search, wishlist, move to cart,
update quantity, verify subtotal, apply an invalid coupon, logout.

## Framework

- Playwright Test + TypeScript (built-in auto-waiting and web-first assertions, no `sleep` calls)
- Page Object Model under `src/pages`, test logic under `tests`
- Reporting: console step log (`src/utils/logger.ts`), Playwright HTML report, screenshot + trace on failure

## Prerequisites

- Node.js 18+

## Setup and run

```bash
npm install
npx playwright install chromium
npm test              # headless
npm run test:headed   # visible browser
npm run report        # open the HTML report
npm run typecheck
```

`BASE_URL` can override the site URL.

## Validation criteria mapping

| # | Criterion | Assertion |
|---|-----------|-----------|
| 1 | Registration successful | "Your registration completed" message and the new email shown in the header |
| 2 | 2 products in wishlist | wishlist row count is 2 and the names match the products added |
| 3 | Products moved to cart | cart row count is 2 and the names match |
| 4 | Subtotal correct | each line total = unit price x quantity, and displayed subtotal = sum of the lines (prices read from the page, nothing hardcoded) |
| 5 | Invalid coupon error | message "The coupon code you entered couldn't be applied to your order" |
| 6 | Logged out | Log in link visible, Log out link gone |

## Assumptions and site behaviour

- Each run registers a unique email (`shopper.<timestamp+random>@example.com`).
- Searching "Book" returns only one product ("Health Book"), and only Health Book can both be wishlisted and
  added to the cart. The other books are missing either the wishlist or the add-to-cart button (e.g. "Fiction EX"
  can be wishlisted but cannot be moved to the cart). So the second item is the first product that supports both
  actions, looked up in Books and then Digital downloads. In practice this is currently "3rd Album".
- Quantity 2 is applied to the first cart line.
