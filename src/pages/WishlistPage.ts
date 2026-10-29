import { Locator, Page } from '@playwright/test';

export class WishlistPage {
  readonly rows: Locator;
  readonly addToCartCheckboxes: Locator;
  readonly addToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('table.cart tbody tr.cart-item-row');
    this.addToCartCheckboxes = page.locator('input[name="addtocart"]');
    this.addToCartButton = page.locator('input[name="addtocartbutton"]');
  }

  async open(): Promise<void> {
    await this.page.goto('/wishlist');
  }

  async productNames(): Promise<string[]> {
    const names = await this.rows.locator('.product a.product-name, .product a').allInnerTexts();
    return names.map((name) => name.trim()).filter(Boolean);
  }

  async moveAllToCart(): Promise<void> {
    const count = await this.addToCartCheckboxes.count();
    for (let i = 0; i < count; i++) {
      await this.addToCartCheckboxes.nth(i).check();
    }
    await this.addToCartButton.click();
  }
}
