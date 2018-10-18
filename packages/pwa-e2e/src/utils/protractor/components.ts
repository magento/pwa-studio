import { Component } from '../../components/abstract.component';

// tslint:disable-next-line:ban-types
export function components<T extends Function>(locator: string, componenet: T, count: number): PropertyDecorator {
    return (target, key) => {
        const isntances: T[] = [];
        for (let index = 0; index < count; index++) {
            const instance = Reflect.construct(componenet, [locator]) as T;
            isntances.push(instance);
        }

        Reflect.defineProperty(target, key, {
            get: (): T[] => isntances,
        });
    };
}