export default class ContainerChild extends Component<any, any, any> {
    static propTypes: {
        id: import("prop-types").Validator<string>;
        render: import("prop-types").Validator<(...args: any[]) => any>;
    };
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
}
import { Component } from "react";
