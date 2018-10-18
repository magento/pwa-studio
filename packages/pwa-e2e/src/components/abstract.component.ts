import { browser, ElementArrayFinder, ElementFinder } from 'protractor';

export abstract class Component extends Function {
    public root: ElementFinder;

    public constructor(public locator: string) {
        super();
        this.root = browser.$(locator);
    }

    public $(locator: string, parent?: ElementFinder): ElementFinder {
        return parent ? parent.$(locator) : this.root.$(locator);
    }

    public $$(locator: string, parent?: ElementFinder): ElementArrayFinder {
        return parent ? parent.$$(locator) : this.root.$$(locator);
    }
}
