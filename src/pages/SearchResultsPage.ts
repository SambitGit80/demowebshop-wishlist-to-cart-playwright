import { Locator, Page } from '@playwright/test';
export class SearchResultsPage {
  readonly productItems: Locator;

  constructor(private readonly page: Page) {
    this.productItems = page.locator('.product-item');
  }

  async openProduct(index: number): Promise<void> {
    await this.productItems.nth(index).locator('.product-title a').click();
  }

  async productNames(): Promise<string[]> {
    const names = await this.productItems.locator('.product-title a').allInnerTexts();
    return names.map((name) => name.trim());
  }
}
