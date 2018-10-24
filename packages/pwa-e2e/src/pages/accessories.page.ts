import { By, ElementArrayFinder, ElementFinder } from 'protractor';
import { Page } from './abstract.page';

import { elements } from 'utils/protractor/elements';

export class AccessoriesPage extends Page {
  @elements('.item-root-ER-') public readonly accessoriesList!: ElementArrayFinder;

  public async chooseAccessory(accessoryName: string): Promise<ElementFinder> {
    const fildAccessory = await Promise.all(
      await this.accessoriesList.filter(async item => {
        const text = await item.findElement(By.css('.item-images-1xN')).getText();
        return text === accessoryName;
      }));

    return fildAccessory[0];
  }

  public fill<T extends Partial<T>>(model: T): void {
    return;
  }
}