import { ClientFunction, Selector, t } from 'testcafe';
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
  return new Promise<Selector>((resove, reject) => {
    if (typeof className === 'string') {
      const classname = `[class^="${className}"]`;
      const el = root ? root.find(classname) : Selector(classname);
      resove(el);
    }
    reject(new Error('classname is not a string'));
  });
});

// you need to import {ClientFunction} from "testcafe";
// this sample will scroll to a label
// see http://devexpress.github.io/testcafe/example/

/**
 * @example ``` ts
 * <label for="windows">
 *   <input type="radio" name="os" id="windows" value="Windows">
 *     Windows
 * </label>
 * await scrollToElement(Selector('label'), {x:20, y:-20})
 * ```
 */
const scrollTo: TypedClientFunction<void, [{ x: number, y: number }]> = ClientFunction(
  (offset: { x: number, y: number }) => window.scrollTo(offset.x, offset.y));

export const SelectorUtils = {
  $class,
  scrollTo,
};
