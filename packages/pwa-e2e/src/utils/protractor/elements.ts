import 'reflect-metadata';

import { browser, ElementArrayFinder } from 'protractor';
import { Component } from '../../components/abstract.component';

/**
 * @description element decorator, that find array of elements by locator from body or component
 * @example 
 * ``` ts
 * class SomecommonComponent extends Component{
 *  @elements('.selector') public readonly someElement: ElementArrayFinder
 * // some another here
 * }
 * ```
 */
export function elements<T extends Component>(locator: string, component?: T): PropertyDecorator {
    return (target, key) => {
        const cls = target.constructor;
        if (cls.prototype === Component) {
            Reflect.defineProperty(target, key, {
                get: (): ElementArrayFinder => component ? component.root.$$(locator) : browser.$$(locator),
            });
        }
        Reflect.defineProperty(target, key, {
            get: (): ElementArrayFinder => component ? component.root.$$(locator) : browser.$$(locator),
        });
    };
}
