/**
 * High order function, which return a new page with specific url
 * @param pageLike function with url as input parameter
 * @example 
 * const PageWithUrl = (url) =>{
 * // page logic here
 * }
 * const specificPage = page(PageWithUrl)('/some-url')
 */
export const page = <T extends (url: string) => any>(pageLike: T) => (url: string): ReturnType<T> => {
  return pageLike(url);
};

/**
 * High order function, which return a new page with dynamic url
 * @param pageLike function with url as input parameter
 * @example 
 * const PageWithUrl = (dynamicUrl) =>{
 * // page logic here
 * }
 * const dynamicUrl = await UrlUtils.getUrl() // Promise<string>
 * const specificPage = dynamicPage(PageWithUrl)(dynamicUrl)
 */
export const dynamicPage = <T extends (url: string) => any>
  (pageLike: T) => async (dynamicUrl: Promise<string>): Promise<Readonly<ReturnType<T>>> => {
    return pageLike(await dynamicUrl);
  };

// export const page1 = (pageLike: any) => (url: string) => {
//   return pageLike(url);
// };
