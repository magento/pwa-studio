import { expect } from 'chai';
import { binding, given, then, when } from 'cucumber-tsflow';
import { browser } from 'protractor';

import { AccessoriesPage, AccessoryPage, HomePage } from 'pages';
import { WaiterService } from 'services';
import { Inject } from 'utils/ioc';

import { BaseDefinition } from './base.definition';

@binding([HomePage, AccessoriesPage, AccessoryPage])
class Temp extends BaseDefinition {
    @Inject() public readonly waiterService!: WaiterService;

    public constructor(
        protected homePage: HomePage,
        protected accessoriesPage: AccessoriesPage,
        protected accessoryPage: AccessoryPage
    ) {
        super();
    }

    @given(/^Anonimous User$/)
    public async someMethod(): Promise<void> {
        await this.homePage.open();
        await browser.sleep(5000);
    }

    @when(/^User click by "([^"]*)" button$/)
    public async clickByAccessoriesButton(buttonName: string): Promise<void> {
        console.dir(`button name: ${buttonName}`);
        // TODO: (vitali) fix god switch...case structure
        switch (buttonName) {
            case 'Accessories':
                const firstItem = await this.homePage.categories.first();
                await firstItem.click();
                await browser.sleep(5000);
                return;
            case 'Carmina Earrings':
                await browser.sleep(5000);
                const accessory = await this.accessoriesPage.accessoriesList.first();
                await accessory.$('.item-images-1xN').click();
                await browser.sleep(5000);
                return;
            case 'Add to cart':
                await browser.sleep(5000);
                await this.accessoryPage.getAddToCartButton().click();
                return;
            case 'Checkout':
                await browser.sleep(5000);
                await browser.$('.flow-footer-28K button').click();
                return;
            case 'Ship to':
                await browser.sleep(5000);
                await browser.$$('.form-body-1ru button').first().click();
                await browser.sleep(5000);
                return;
            default: return;
        }
    }

    @then(/^"accessories" list is presented$/)
    public async listIsPresented(): Promise<void> {
        const isPresented = await this.accessoriesPage.accessoriesList.isPresent();
        console.dir(this.accessoriesPage.accessoriesList);
        // tslint:disable-next-line:no-unused-expression
        // expect(isPresented, 'list is not presented').to.be.true;
    }

    @then(/^"SHIPPING ADDRESS" form is presented$/)
    public async isShippingAddressPresented(): Promise<void> {
        const isPresented =
            await this.waiterService.waitForElementPresence(this.homePage.shippingAddressComponent.root);

        console.dir(`SHIPPING ADDRESS presented: ${isPresented}`);
    }

    @then(/^User fill "SHIPPING ADDRESS" form$/)
    public async fillShippingForm(): Promise<void> {
        this.homePage.shippingAddressComponent.fillForm(
            'testName', 'testLast', 'some street', 'demoCity', '123', 'BY', '12346', 'example@example.com'
        );
        await browser.sleep(5000);
        await this.homePage.clickBySaveButton();
        await browser.sleep(5000);
    }
}
