export const Consumer: React.Consumer<any>;
export const Provider: React.Provider<any>;
export default class MagentoRouter extends React.Component<any, any, any> {
    static propTypes: {
        apiBase: import("prop-types").Validator<string>;
        routerProps: import("prop-types").Requireable<object>;
        using: import("prop-types").Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        routerProps: {};
        using: any;
    };
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
}
import React from "react";
