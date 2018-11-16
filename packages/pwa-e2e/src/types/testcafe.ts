import { DefaultReactComponent, Props } from './react';

type Primitives = object | number | string | boolean | undefined | null;
type TypeofPrimitives = 'function' | 'object' | 'number' | 'string' | 'boolean' | 'undefined';

declare global {

  interface Selector {
    getReact<
      C extends DefaultReactComponent
      >
      (fn: (reactInternal: C) => any): Promise<any>;

    getReact<
      C extends DefaultReactComponent
      >
      (): Promise<C>;

    withProps<
      P extends Props
      >
      (propName: keyof P, propValue?: Partial<P[keyof P]>, options?: { exactObjectMatch: boolean }): Selector;

    withProps<P extends Props>(props: Partial<P>, options?: { exactObjectMatch: boolean }): Selector;

    findReact(selector: string): Selector;
  }

  interface TestController {
    expect<A>(actual: A): Assertion<A>;
  }
  interface Assertion<E = any> {
    eql(expected: E, message?: string, options?: AssertionOptions): TestControllerPromise;
    contains(expected: E, message?: string, options?: AssertionOptions): TestControllerPromise;
    // tslint:disable-next-line:max-line-length
    typeOf(typeName: TypeofPrimitives | 'regex' | 'null', message?: string, options?: AssertionOptions): TestControllerPromise;
    typeOf(typeName: TypeofPrimitives | 'regex' | 'null', options?: AssertionOptions): TestControllerPromise;
    // tslint:disable-next-line:max-line-length
    notTypeOf(typeName: TypeofPrimitives | 'regex' | 'null', message?: string, options?: AssertionOptions): TestControllerPromise;
    notTypeOf(typeName: TypeofPrimitives | 'regex' | 'null', options?: AssertionOptions): TestControllerPromise;
  }
}

export interface TypedClientFunction<R = any, A extends any[]= any[]> extends ClientFunction {
  /**
   * Client function
   *
   * @param args - Function arguments.
   */
  (...args: A): Promise<R>;

  /**
   * Returns a new client function with a different set of options that includes options from the
   * original function and new `options` that overwrite the original ones.
   *
   * @param options - New options.
   */
  with(options: ClientFunctionOptions): ClientFunction;
}
