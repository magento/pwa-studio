module.exports = [
    {
        target: 'pwa-buildpack/lib/BuildBus/declare-base.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/ModuleTransformConfig.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/BuildBus/TargetProvider.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/BuildBus/BuildBus.js',
        type: 'function',
        childComponents: [
            'pwa-buildpack/lib/BuildBus/declare-base.js',
            'pwa-buildpack/lib/BuildBus/mapHooksToTargets.js',
            'pwa-buildpack/lib/BuildBus/Target.js',
            'pwa-buildpack/lib/BuildBus/Trackable.js',
            'pwa-buildpack/lib/BuildBus/TargetProvider.js',
        ]
    },
    {
        target: 'pwa-buildpack/lib/BuildBus/Target.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/Utilities/getEnvVarDefinitions.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/TargetableModule.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/TargetableESModule.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/TargetableESModuleArray.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/TargetableESModuleObject.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/TargetableReactComponent.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/TargetableSet.js',
        type: 'function'
    },
    {
        target: 'pwa-buildpack/lib/WebpackTools/targetables/SingleImportStatement.js',
        type: 'function'
    }
];
