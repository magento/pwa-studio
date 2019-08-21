module.exports = api => {
    const config = {
        presets: ['@magento/peregrine'],
        exclude: [/packages\/babel\-preset\-peregrine\//]
    };
    if (api.env() === 'development') {
        // Ignore everything with underscores except stories in dev mode
        config.exclude.push(/\/__(tests?|mocks|fixtures|helpers|dist)__\//);
    }
    return config;
};
