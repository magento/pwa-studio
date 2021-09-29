function makeRoutesTarget(venia) {
    const routeList = venia.reactComponent(
        '@magento/venia-ui/lib/components/Routes/routes.js',
        async ({ routes }, self) => addRoutes(self, await routes.promise([]))
    );

    // Add our own default routes!
    addRoutes(routeList, require('../defaultRoutes.json'));
}

function addRoutes(routeList, routes) {
    const AuthRouteComponent = routeList.addImport(
        'import AuthRoute from "./authRoute"'
    );

    for (const route of routes) {
        const AddedRoute = routeList.addReactLazyImport(route.path, route.name);
        const exact = route.exact ? 'exact ' : '';
        const path = JSON.stringify(route.pattern);
        const redirectTo =
            route.authed && route.redirectTo
                ? JSON.stringify(route.redirectTo)
                : null;
        const redirectToProp = redirectTo ? `redirectTo={${redirectTo}} ` : '';
        const Component = route.authed ? AuthRouteComponent : 'Route';

        routeList.prependJSX(
            'Switch',
            `<${Component} ${exact}${redirectToProp}path={${path}}><${AddedRoute}/></${Component}>`
        );

        routeList.insertAfterSource(
            'const availableRoutes = [];',
            'availableRoutes.push(' + JSON.stringify(route) + ');'
        );
    }
}

module.exports = makeRoutesTarget;
