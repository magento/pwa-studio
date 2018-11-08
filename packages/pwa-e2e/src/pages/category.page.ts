import { Constructorable } from 'types';

import { Page } from './abstract.page';

export class CategoryPage<P extends Page> extends Page {
  toCategory(instance: Constructorable<P>, ...args: any[]): P {
    return Reflect.construct(instance, args);
  }
}