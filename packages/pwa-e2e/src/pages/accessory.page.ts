import { ElementArrayFinder, ElementFinder } from 'protractor';

import { Page } from './abstract.page';

import { elements } from 'utils/protractor';

export class AccessoryPage extends Page {
  @elements('.button-content-3ns') public readonly clickableButtons!: ElementArrayFinder;

  public getAddToCartButton(): ElementFinder {
    return this.clickableButtons.get(1);
  }
  public fill<T extends Partial<T>>(model: T): void {
    return;
  }
}