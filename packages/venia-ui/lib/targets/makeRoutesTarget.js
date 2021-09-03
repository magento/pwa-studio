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
        const authed = route.authed ? 'authed ' : '';
        const path = JSON.stringify(route.pattern);
        const redirectTo = route.redirectTo
            ? JSON.stringify(route.redirectTo)
            : null;
        const redirectToProp = redirectTo ? `redirectTo={${redirectTo}} ` : '';

        routeList.prependJSX(
            'Switch',
            `<AuthRoute ${exact}${authed}${redirectToProp}path={${path}}><${AddedRoute}/></AuthRoute>`
        );
    }
}

module.exports = makeRoutesTarget;
