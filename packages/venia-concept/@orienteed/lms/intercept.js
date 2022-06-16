module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true,
            i18n: true,
            graphqlQueries: true
        };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'Courses',
                pattern: '/learning',
                path: '@orienteed/lms/src/components/LearningRoute'
            },
            {
                name: 'Course',
                pattern: '/course',
                path: '@orienteed/lms/src/components/LearningRoute'
            }
        );
        return routes;
    });

    // Override useAccountMenuItems talon
    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.AccountMenu.useAccountMenuItems.wrapWith('@orienteed/lms/src/talons/useAccountMenuItems.js');
    });
};
