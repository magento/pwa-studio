module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');
    process.env.LMS_ENABLED === 'true' &&
        builtins.specialFeatures.tap(features => {
            features[targets.name] = {
                esModules: true,
                cssModules: true,
                i18n: true,
                graphqlQueries: true
            };
        });

    process.env.LMS_ENABLED === 'true' &&
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
};
