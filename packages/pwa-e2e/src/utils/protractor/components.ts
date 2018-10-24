// tslint:disable-next-line:ban-types
export function components<T extends Function>(locator: string, component: T, count: number): PropertyDecorator {
    return (target, key) => {
        const instances: T[] = [];
        for (let index = 0; index < count; index++) {
            const instance = Reflect.construct(component, [locator]) as T;
            instances.push(instance);
        }

        Reflect.defineProperty(target, key, {
            get: (): T[] => instances,
        });
    };
}