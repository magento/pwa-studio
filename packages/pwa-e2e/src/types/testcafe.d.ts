import { Selector } from 'testcafe';
import { Component } from 'components/abstract.component';
import { Props, ReactComponent, State, DefautReactComponent } from './react';
import { Dictionary } from './common';

type Primitives = object | number | string | boolean | undefined | null;
type TypeofPrimitives = 'function' | 'object' | 'number' | 'string' | 'boolean' | 'undefined' | 'null';

declare global {

  interface Selector {
    getReact<
      C extends DefautReactComponent
      >
      (fn: (reactInternal: C) => any): Promise<any>;

    getReact<
      C extends DefautReactComponent
      >
      (): Promise<C>;

    withProps<V>(propName: string, propValue?: V, options?: { exactObjectMatch: boolean }): Selector;

    withProps<P extends Props>(props: P, options?: { exactObjectMatch: boolean }): Selector;

    findReact(selector: string): Selector;
  }

  interface TestController {
    expect<A>(actual: A): Assertion<A>;
  }
  // typeof null => 'object'
  interface Assertion<E = any> {
    eql(expected: E, message?: string, options?: AssertionOptions): TestControllerPromise;
    contains(expected: E, message?: string, options?: AssertionOptions): TestControllerPromise;
    typeOf(typeName: Exclude<TypeofPrimitives, 'null'>, message?: string, options?: AssertionOptions): TestControllerPromise;
    typeOf(typeName: Exclude<TypeofPrimitives, 'null'>, options?: AssertionOptions): TestControllerPromise;
    notTypeOf(typeName: Exclude<TypeofPrimitives, 'null'>, message?: string, options?: AssertionOptions): TestControllerPromise;
    notTypeOf(typeName: Exclude<TypeofPrimitives, 'null'>, options?: AssertionOptions): TestControllerPromise;
  }
}

interface TypedClientFunction<R, A = any[]> extends ClientFunction {
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
