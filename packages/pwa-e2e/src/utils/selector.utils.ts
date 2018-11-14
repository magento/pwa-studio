import { ClientFunction, Selector } from 'testcafe';
import { TypedClientFunction } from 'types/testcafe';

/**
 * @description convert class name to regex matching.
 * @param {string} className - name of class
 * @param {Selector} root root element.
 * @default root = undefined
 * @returns Promise
 * @example ```ts
 * await SelectorUtils.$class('some-list') // Selector("[class^='some-list']")
 * ```
 */
const $class = ClientFunction((className: string, root?: Selector) => {
  return new Promise<Selector>((resolve, reject) => {
    if (typeof className === 'string') {
      const classnames = `[class^="${className}"]`;
      const el = root ? root.find(classnames) : Selector(classnames);
      resolve(el);
    }
    reject(new Error('class name is not a string'));
  });
});

type Offset = { x: number, y: number };

/**
 * @example ``` ts
 * <label for="windows">
 *   <input type="radio" name="os" id="windows" value="Windows">
 *     Windows
 * </label>
 * await scrollTo({x:20, y:-20})
 * ```
 */
const scrollTo: TypedClientFunction<unknown, [Offset]> = ClientFunction(
  ({ x, y }: Offset) => window.scrollTo(x, y)
);

export const SelectorUtils = {
  $class,
  scrollTo,
};