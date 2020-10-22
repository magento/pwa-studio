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
                allowedStrings: [],
                // Use ignoreProps: false to catch label/title/alt text, etc.
                // Has the downside of erroring on "id" and other string props.
                ignoreProps: true,
                noStrings: true
            }
        ]
    }
};

module.exports = config;
