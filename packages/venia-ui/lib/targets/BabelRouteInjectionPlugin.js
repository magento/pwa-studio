const babelTemplate = require('@babel/template');

function BabelRouteInjectionPlugin(babel) {
    const { types: t } = babel;

    const lazyRouteImport = babelTemplate.statement(
        `const %%id%% = React.lazy(() => import(%%path%%));`,
        {
            plugins: ['dynamicImport']
        }
    );

    return {
        visitor: {
            Program: {
                enter(path, state) {
                    state.routes = [];
                    const seenPatterns = new Map();
                    const seenModules = new Map();
                    const requests = this.opts.requestsByFile[this.filename];
                    for (const request of requests) {
                        const { requestor } = request;
                        for (const route of request.options.routes) {
                            const routeWithRequestor = { ...route, requestor };
                            const seenPattern = seenPatterns.get(route.pattern);
                            if (!seenPattern)
                                seenPatterns.set(
                                    route.pattern,
                                    routeWithRequestor
                                );

                            const seenExactPattern =
                                seenPattern &&
                                seenPattern.exact === route.exact;

                            const seenModule = seenModules.get(route.path);
                            if (!seenModule)
                                seenModules.set(route.path, routeWithRequestor);

                            if (!seenModule && !seenExactPattern) {
                                // a nice, fresh route!
                                state.routes.push(route);
                            } else if (seenExactPattern) {
                                throw new Error(
                                    `@magento/venia-ui: Conflict in "routes" target. "${
                                        request.requestor
                                    }" is trying to add a route ${JSON.stringify(
                                        route
                                    )}, but "${
                                        seenExactPattern.requestor
                                    }" has already declared that route pattern: ${JSON.stringify(
                                        seenExactPattern
                                    )}`
                                );
                            } else if (seenModule) {
                                throw new Error(
                                    `@magento/venia-ui: Conflict in "routes" target. "${
                                        request.requestor
                                    }" is trying to add a route ${JSON.stringify(
                                        route
                                    )}, but "${
                                        seenModule.requestor
                                    }" has already declared another pattern for that same module: ${JSON.stringify(
                                        seenModule
                                    )}`
                                );
                            }
                            // if we got here, both have been seen, so this is an exact duplicate;
                            // fine to do nothing.
                        }
                    }
                    const dynamicImports = [];
                    state.routeElements = [];
                    for (const route of state.routes) {
                        const id = path.scope.generateUidIdentifier(route.name);
                        // must begin with uppercase!
                        id.name = 'InjectedRoute_' + id.name;
                        dynamicImports.push(
                            lazyRouteImport({
                                id,
                                path: t.stringLiteral(route.path)
                            })
                        );
                        state.routeElements.push(
                            babelTemplate.expression.ast(
                                `<Route ${route.exact ? 'exact ' : ''}path="${
                                    route.pattern
                                }"><${id.name}/></Route>`,
                                { plugins: ['jsx'] }
                            )
                        );
                    }
                    path.unshiftContainer('body', dynamicImports);
                }
            },
            JSXElement: {
                enter(path, state) {
                    if (state.routesInserted) return;
                    const { openingElement } = path.node;
                    const elmId = openingElement && openingElement.name;
                    if (elmId && elmId.name === 'Route') {
                        path.insertBefore(state.routeElements);
                        state.routesInserted = true;
                    }
                }
            }
        }
    };
}

module.exports = BabelRouteInjectionPlugin;
