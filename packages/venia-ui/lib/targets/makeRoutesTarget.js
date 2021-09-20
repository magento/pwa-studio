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
            `<Route ${route.exact ? 'exact ' : ''}path={${JSON.stringify(
                route.pattern
            )}}><${AddedRoute}/></Route>`
        );

        routeList.insertAfterSource(
            'const availableRoutes = [];',
            'availableRoutes.push(' + JSON.stringify(route) + ');'
        );
    }
}

module.exports = makeRoutesTarget;
