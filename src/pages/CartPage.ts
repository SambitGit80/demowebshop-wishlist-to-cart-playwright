import { Locator, Page } from '@playwright/test';
import { parsePrice } from '../utils/testData';

export interface CartLine {
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export class CartPage {
  readonly rows: Locator;
  readonly updateCartButton: Locator;
  readonly subtotal: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponMessage: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('table.cart tbody tr.cart-item-row');
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.subtotal = page.locator('.cart-total .order-subtotal .product-price').first();
    this.couponInput = page.locator('input[name="discountcouponcode"]');
    this.applyCouponButton = page.locator('input[name="applydiscountcouponcode"]');
    this.couponMessage = page.locator('.coupon-box .message');
  }

  async productNames(): Promise<string[]> {
    const names = await this.rows.locator('.product a.product-name, .product a').allInnerTexts();
    return names.map((name) => name.trim()).filter(Boolean);
  }

  async setQuantity(rowIndex: number, quantity: number): Promise<void> {
    await this.rows.nth(rowIndex).locator('input.qty-input').fill(String(quantity));
    await this.updateCartButton.click();
    await this.page.waitForLoadState('load');
  }

  async lines(): Promise<CartLine[]> {
    const count = await this.rows.count();
    const lines: CartLine[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      lines.push({
        name: (await row.locator('.product a').first().innerText()).trim(),
        unitPrice: parsePrice(await row.locator('.unit-price').innerText()),
        quantity: Number(await row.locator('input.qty-input').inputValue()),
        lineTotal: parsePrice(await row.locator('.subtotal .product-subtotal').innerText()),
      });
    }
    return lines;
  }

  async displayedSubtotal(): Promise<number> {
    return parsePrice(await this.subtotal.innerText());
  }

  async applyCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }
}
