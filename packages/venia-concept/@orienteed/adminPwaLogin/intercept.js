module.exports = targets => {
    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            name: 'AdminPwaLogin',
            pattern: '/pwa/sign-in/:customer_token',
            path: '@orienteed/adminPwaLogin/src/Login'
        });
        return routes;
    });
};
