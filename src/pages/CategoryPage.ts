import { Locator, Page } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class CategoryPage {
  readonly productTitles: Locator;

  constructor(private readonly page: Page, private readonly productPage: ProductPage) {
    this.productTitles = page.locator('.product-item .product-title a');
  }

  async open(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Opens the first product in the category that can be both wishlisted and added to the cart,
   * skipping any product named in `excludedNames`. Returns false when none qualifies.
   */
  async openFirstEligibleProduct(path: string, excludedNames: string[]): Promise<boolean> {
    await this.open(path);
    await this.productTitles.first().waitFor();
    const names = (await this.productTitles.allInnerTexts()).map((name) => name.trim());

    for (const name of names.filter((candidate) => !excludedNames.includes(candidate))) {
      await this.productTitles.filter({ hasText: name }).first().click();
      if (await this.productPage.isWishlistAndCartAvailable()) {
        return true;
      }
      await this.open(path);
    }
    return false;
  }
}
