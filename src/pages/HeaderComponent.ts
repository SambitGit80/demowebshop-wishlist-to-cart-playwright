import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly registerLink: Locator;
  readonly logoutLink: Locator;
  readonly loginLink: Locator;
  readonly accountLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(private readonly page: Page) {
    this.registerLink = page.locator('.header-links a.ico-register');
    this.logoutLink = page.locator('.header-links a.ico-logout');
    this.loginLink = page.locator('.header-links a.ico-login');
    this.accountLink = page.locator('.header-links a.account');
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.search-box-button');
  }

  async openRegistration(): Promise<void> {
    await this.registerLink.click();
  }

  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
