function makeRoutesTarget(venia) {
    const routeList = venia.reactComponent(
        '@magento/venia-ui/lib/components/Routes/routes.js',
        async ({ routes }, self) => addRoutes(self, await routes.promise([]))
    );

    // Add our own default routes!
    addRoutes(routeList, require('../defaultRoutes.json'));
}

function addRoutes(routeList, routes) {
    for (const route of routes) {
        const AddedRoute = routeList.addReactLazyImport(route.path, route.name);
        routeList.prependJSX(
            'Switch',
            `<AuthRoute ${route.exact ? 'exact ' : ''}${
                route.authed ? 'authed ' : ''
            }path={${JSON.stringify(
                route.pattern
            )}}><${AddedRoute}/></AuthRoute>`
        );
    }
}

module.exports = makeRoutesTarget;
