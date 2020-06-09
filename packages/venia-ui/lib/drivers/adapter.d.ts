export default VeniaAdapter;
/**
 * The counterpart to `@magento/venia-drivers` is an adapter that provides
 * context objects to the driver dependencies. The default implementation in
 * `@magento/venia-drivers` uses modules such as `react-redux`, which
 * have implicit external dependencies. This adapter provides all of them at
 * once.
 *
 * Consumers of Venia components can either implement a similar adapter and
 * wrap their Venia component trees with it, or they can override `src/drivers`
 * so its components don't depend on context and IO.
 *
 * @param {String} props.apiBase base path for url
 * @param {Object} props.apollo.cache an apollo cache instance
 * @param {Object} props.apollo.client an apollo client instance
 * @param {Object} props.apollo.link an apollo link instance
 * @param {Object} props.apollo.initialData cache data for initial state and on reset
 * @param {Object} props.store redux store to provide
 */
declare function VeniaAdapter(props: any): JSX.Element;
declare namespace VeniaAdapter {
    export function apolloLink(apiBase: any): import("apollo-link").ApolloLink;
    export namespace propTypes {
        export const apiBase: import("prop-types").Validator<string>;
        export const apollo: import("prop-types").Requireable<import("prop-types").InferProps<{
            client: import("prop-types").Requireable<import("prop-types").InferProps<{
                query: import("prop-types").Validator<(...args: any[]) => any>;
            }>>;
            link: import("prop-types").Requireable<import("prop-types").InferProps<{
                request: import("prop-types").Validator<(...args: any[]) => any>;
            }>>;
            cache: import("prop-types").Requireable<import("prop-types").InferProps<{
                readQuery: import("prop-types").Validator<(...args: any[]) => any>;
            }>>;
        }>>;
        export const store: import("prop-types").Validator<import("prop-types").InferProps<{
            dispatch: import("prop-types").Validator<(...args: any[]) => any>;
            getState: import("prop-types").Validator<(...args: any[]) => any>;
            subscribe: import("prop-types").Validator<(...args: any[]) => any>;
        }>>;
    }
}
