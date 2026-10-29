import { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/testData';

export class ProductPage {
  readonly productName: Locator;
  readonly price: Locator;
  readonly addToWishlistButton: Locator;
  readonly addToCartButton: Locator;
  readonly notificationBar: Locator;

  constructor(private readonly page: Page) {
    this.productName = page.locator('.product-name h1');
    this.price = page.locator('.product-price span').first();
    this.addToWishlistButton = page.locator('.add-to-wishlist-button');
    this.addToCartButton = page.locator('.add-to-cart-button');
    this.notificationBar = page.locator('#bar-notification.success');
  }

  async name(): Promise<string> {
    return (await this.productName.innerText()).trim();
  }

  async unitPrice(): Promise<number> {
    return parsePrice(await this.price.innerText());
  }

  async isWishlistAndCartAvailable(): Promise<boolean> {
    await this.productName.waitFor();
    return (await this.addToWishlistButton.count()) > 0 && (await this.addToCartButton.count()) > 0;
  }

  async addToWishlist(): Promise<void> {
    await this.addToWishlistButton.click();
    await this.notificationBar.waitFor({ state: 'visible' });
    await this.page.locator('#bar-notification .close').click();
    await this.notificationBar.waitFor({ state: 'hidden' });
  }
}
