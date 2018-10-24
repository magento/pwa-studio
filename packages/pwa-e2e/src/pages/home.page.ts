import { By, ElementArrayFinder, ElementFinder } from 'protractor';
import { Page } from './abstract.page';

import { ShippingAddressComponent } from 'components';
import { Model } from 'models';
import { Injectable } from 'utils/ioc';
import { timerify } from 'utils/performance';
import { component, element, elements } from 'utils/protractor';

@Injectable()
export class HomePage extends Page {

    @element('button.cartTrigger-root-3qR') public readonly cartButton!: ElementFinder;
    @elements('.categoryList-item-2LB') public readonly categories!: ElementArrayFinder;

    @component('.address-body-1MH') public readonly shippingAddressComponent!: ShippingAddressComponent;
    @elements('.address-footer-2Sx button') public readonly addressActions!: ElementArrayFinder;
    public async open(): Promise<void> {
        return await super.open('https://magento-venia.now.sh');
    }

    public async chooseCategory(categoryName: string): Promise<ElementFinder> {
        const findCategories = await Promise.resolve(
            this.categories.filter(async category => {
                const text = await category.$('.categoryList-name-vNr').getText();
                return text === categoryName;
            }));

        return findCategories[0];
    }

    @timerify()
    public fill<T extends Model<T>>(model: T): void {
        return;
    }

    public async clickBySaveButton(): Promise<void> { 
        await this.addressActions.first().click();
    }
}
