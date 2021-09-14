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
        const exact = route.exact ? 'exact ' : '';
        const path = JSON.stringify(route.pattern);
        const redirectTo =
            route.authed && route.redirectTo
                ? JSON.stringify(route.redirectTo)
                : null;
        const redirectToProp = redirectTo ? `redirectTo={${redirectTo}} ` : '';
        const Component = route.authed ? 'AuthRoute' : 'Route';

        routeList.prependJSX(
            'Switch',
            `<${Component} ${exact}${redirectToProp}path={${path}}><${AddedRoute}/></${Component}>`
        );
    }
}

module.exports = makeRoutesTarget;
