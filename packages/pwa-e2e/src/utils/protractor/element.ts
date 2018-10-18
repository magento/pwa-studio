import 'reflect-metadata';

import { browser, ElementFinder } from 'protractor';
import { Component } from '../../components/abstract.component';

/**
 * @description element decorator, that find element by locator from body or component
 * @param locator locator for searching from parent. If it not set, taken from body
 * @example 
 * ``` ts
 * 
 * class SomecommonComponent extends Component{
 *  @element('.selector') public readonly someElement: ElementFinder
 * // some another here
 * }
 * ```
 */
export function element<T extends Component>(locator: string, component?: T | ElementFinder): PropertyDecorator {
    return (target, key) => {
        Reflect.defineProperty(target, key, {
            get: (): ElementFinder => {
                return (component) ?
                    (
                        (component instanceof Component) ?
                            component.root.$(locator) :
                            component.$(locator)
                    ) :
                    browser.$(locator);
            },
        });
    };
}
