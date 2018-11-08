import { Constructorable } from 'types';

export abstract class Page extends Function {
  public readonly fullUrl: string;

  public constructor(
    public readonly baseUrl: string,
    public readonly url: string = '/',
  ) {
    super();
    this.fullUrl = baseUrl + url;
  }

  static toPage<P>(instance: Constructorable<P>, ...args: any[]): P {
    return Reflect.construct(instance, args);
  }

  toPage<P>(instance: Constructorable<P>, ...args: any[]): P {
    return Reflect.construct(instance, args);
  }
}
