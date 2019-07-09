module.exports = api => {
    const config = { presets: ['@magento/peregrine'] };
    if (api.env() === 'development') {
        // Ignore everything with underscores except stories in dev mode
        config.exclude = [
            /\/__(tests?|mocks|fixtures|helpers|dist|packages\/babel\-preset\-peregrine)__\//
        ];
    }
    return config;
};
