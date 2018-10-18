import 'reflect-metadata';

import { Component } from '../../components/abstract.component';

export function component<T extends Component>(locator: string): PropertyDecorator {
    return (target, key) => {
        const type = Reflect.getMetadata('design:type', target, key) as T;

        Reflect.defineProperty(target, key, {
            get: () => Reflect.construct(type, [locator]),
        });
    };
}