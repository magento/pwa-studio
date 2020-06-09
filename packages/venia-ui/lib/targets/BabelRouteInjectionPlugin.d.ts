export = BabelRouteInjectionPlugin;
declare function BabelRouteInjectionPlugin(babel: any): {
    visitor: {
        Program: {
            enter(path: any, state: any): void;
        };
        JSXElement: {
            enter(path: any, state: any): void;
        };
    };
};
