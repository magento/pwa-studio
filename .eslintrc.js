const config = {
    parser: 'babel-eslint',
    plugins: ['react'],
    extends: ['@magento'],
    rules: {
        'no-undef': 'off',
        'no-useless-escape': 'off',
        'react/jsx-no-literals': [
            'error',
            {
                allowedStrings: ['defaultMessage'],
                // TODO: Come back, set to "false" temporarily to catch labels/title/alt etc.
                ignoreProps: true,
                noStrings: true
            }
        ]
    }
};

module.exports = config;
