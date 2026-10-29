import { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/testData';

export interface Product {
  name: string;
  unitPrice: number;
}

export class SearchResultsPage {
  readonly productItems: Locator;

  constructor(private readonly page: Page) {
    this.productItems = page.locator('.product-item');
  }

  async openProduct(index: number): Promise<void> {
    await this.productItems.nth(index).locator('.product-title a').click();
  }

  async productNameAt(index: number): Promise<string> {
    return (await this.productItems.nth(index).locator('.product-title a').innerText()).trim();
  }

  async priceAt(index: number): Promise<number> {
    return parsePrice(await this.productItems.nth(index).locator('.prices .actual-price').innerText());
  }
}
