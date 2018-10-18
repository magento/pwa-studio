import 'reflect-metadata';

import { Inject as _Inject, Injector } from 'di-typescript';

const injector = new Injector();
export function Injectable(): ClassDecorator {
  return (target) => {

    return _Inject(target);
  };
}
export function Inject(): PropertyDecorator {
  return (target, key) => {
    const type = Reflect.getMetadata('design:type', target, key);
    Reflect.defineProperty(target, key, {
      get: () => injector.get(type),
    });
  };
}
export default {
  Inject,
  Injectable,
};
