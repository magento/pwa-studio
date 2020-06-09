export default class MagentoRouteHandler extends React.Component<any, any, any> {
    static propTypes: {
        apiBase: import("prop-types").Validator<string>;
        children: import("prop-types").Requireable<(...args: any[]) => any>;
        location: import("prop-types").Validator<import("prop-types").InferProps<{
            pathname: import("prop-types").Validator<string>;
        }>>;
    };
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
    addToCache(urls: any): Promise<void>;
    getRouteComponent(): Promise<void>;
    setRouteComponent(pathname: any, RootComponent: any, meta: any): void;
    renderChildren(loading: any): any;
}
import React from "react";
