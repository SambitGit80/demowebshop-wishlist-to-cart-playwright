import { expect, test } from '@playwright/test';
import { CartPage } from '../src/pages/CartPage';
import { CategoryPage } from '../src/pages/CategoryPage';
import { HeaderComponent } from '../src/pages/HeaderComponent';
import { ProductPage } from '../src/pages/ProductPage';
import { RegisterPage } from '../src/pages/RegisterPage';
import { SearchResultsPage } from '../src/pages/SearchResultsPage';
import { WishlistPage } from '../src/pages/WishlistPage';
import { logStep } from '../src/utils/logger';
import { generateUser } from '../src/utils/testData';

const SEARCH_KEYWORD = 'Book';
const BOOKS_TO_WISHLIST = 2;
const SECOND_PRODUCT_CATEGORIES = ['/books', '/digital-downloads'];
const INVALID_COUPON = 'INVALID-COUPON-123';
const INVALID_COUPON_MESSAGE = "The coupon code you entered couldn't be applied to your order";

async function openSecondProduct(categoryPage: CategoryPage, firstProductName: string): Promise<boolean> {
  for (const categoryPath of SECOND_PRODUCT_CATEGORIES) {
    if (await categoryPage.openFirstEligibleProduct(categoryPath, [firstProductName])) {
      logStep(`Second product picked from ${categoryPath}`);
      return true;
    }
    logStep(`No eligible product in ${categoryPath}, trying next category`);
  }
  return false;
}

test('Wishlist to cart journey with subtotal and invalid coupon validation', async ({ page }) => {
  const header = new HeaderComponent(page);
  const registerPage = new RegisterPage(page);
  const searchResults = new SearchResultsPage(page);
  const productPage = new ProductPage(page);
  const categoryPage = new CategoryPage(page, productPage);
  const wishlistPage = new WishlistPage(page);
  const cartPage = new CartPage(page);
  const user = generateUser();

  await test.step('Register a new user with a unique email', async () => {
    logStep(`Registering ${user.email}`);
    await page.goto('/');
    await header.openRegistration();
    await registerPage.register(user);

    await expect(registerPage.resultMessage).toHaveText('Your registration completed');
    await registerPage.continueButton.click();
    await expect(header.accountLink).toHaveText(user.email);
  });

  const wishlistedBooks: { name: string; unitPrice: number }[] = [];

  await test.step('Search for "Book" and add 2 books to the wishlist', async () => {
    await header.search(SEARCH_KEYWORD);
    await expect(searchResults.productItems.first()).toBeVisible();
    const resultNames = await searchResults.productNames();
    for (const name of resultNames) {
      expect(name.toLowerCase()).toContain(SEARCH_KEYWORD.toLowerCase());
    }

    await searchResults.openProduct(0);
    const firstBook = { name: await productPage.name(), unitPrice: await productPage.unitPrice() };
    logStep(`Adding to wishlist: ${firstBook.name} @ ${firstBook.unitPrice}`);
    await productPage.addToWishlist();
    wishlistedBooks.push(firstBook);

    const secondBookFound = await openSecondProduct(categoryPage, firstBook.name);
    expect(secondBookFound, 'a second product that can be wishlisted and added to the cart').toBe(true);
    const secondBook = { name: await productPage.name(), unitPrice: await productPage.unitPrice() };
    logStep(`Adding to wishlist: ${secondBook.name} @ ${secondBook.unitPrice}`);
    await productPage.addToWishlist();
    wishlistedBooks.push(secondBook);
  });

  await test.step('Verify 2 products are present in the wishlist', async () => {
    await wishlistPage.open();
    await expect(wishlistPage.rows).toHaveCount(BOOKS_TO_WISHLIST);
    expect((await wishlistPage.productNames()).sort()).toEqual(wishlistedBooks.map((b) => b.name).sort());
  });

  await test.step('Move both products from wishlist to cart', async () => {
    await wishlistPage.moveAllToCart();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(cartPage.rows).toHaveCount(BOOKS_TO_WISHLIST);
    expect((await cartPage.productNames()).sort()).toEqual(wishlistedBooks.map((b) => b.name).sort());
  });

  await test.step('Update quantity of one product to 2', async () => {
    await cartPage.setQuantity(0, 2);
    const lines = await cartPage.lines();
    expect(lines[0].quantity).toBe(2);
    expect(lines[1].quantity).toBe(1);
  });

  await test.step('Verify the cart subtotal is calculated correctly', async () => {
    const lines = await cartPage.lines();
    for (const line of lines) {
      expect(line.lineTotal, `line total for ${line.name}`).toBeCloseTo(line.unitPrice * line.quantity, 2);
    }
    const expectedSubtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
    logStep(`Expected subtotal ${expectedSubtotal.toFixed(2)}`);
    expect(await cartPage.displayedSubtotal()).toBeCloseTo(expectedSubtotal, 2);
  });

  await test.step('Apply an invalid coupon and verify the error message', async () => {
    await cartPage.applyCoupon(INVALID_COUPON);
    await expect(cartPage.couponMessage).toContainText(INVALID_COUPON_MESSAGE);
  });

  await test.step('Logout', async () => {
    await header.logout();
    await expect(header.loginLink).toBeVisible();
    await expect(header.logoutLink).toHaveCount(0);
  });
});
