import { browser, ElementFinder, ExpectedConditions } from 'protractor';

import { Injectable } from 'utils/ioc';

@Injectable()
export class WaiterService {

    private DEFAULT_WAIT_TIME: number = 30000;

    public async waitForElementPresence(element: ElementFinder, timeout?: number): Promise<boolean> {
        const isElementPresence = await this.wait(ExpectedConditions.presenceOf(element), timeout);

        if (!isElementPresence) {
            console.dir('element is not presence');
        }

        return isElementPresence;
    }

    public async waitForElementVisibility(element: ElementFinder, timeout?: number): Promise<boolean> {
        const isElementVisible = await this.wait(ExpectedConditions.visibilityOf(element), timeout);

        if (!isElementVisible) {
            console.dir('element is not visible');
        }

        return isElementVisible;
    }

    public async waitForElementInvisibility(element: ElementFinder, timeout?: number): Promise<boolean> {
        const isElementInvisible = await this.wait(ExpectedConditions.invisibilityOf(element), timeout);

        if (!isElementInvisible) {
            console.dir('element still visible');
        }

        return isElementInvisible;
    }

    public async waitForTextPresence(element: ElementFinder, text: string, timeout?: number): Promise<boolean> {
        const isTextPresence = await this.wait(ExpectedConditions.textToBePresentInElement(element, text), timeout);

        if (!isTextPresence) {
            console.dir('text is not presence');
        }

        return isTextPresence;
    }

    // tslint:disable-next-line:ban-types
    public async wait(fn: Function, timeout?: number): Promise<boolean> {
        const waitTime = !timeout || timeout <= 0 ? this.DEFAULT_WAIT_TIME : timeout;

        return browser.wait(fn, waitTime)
            .then(() => true)
            .catch<boolean>(() => false);
    }
}
