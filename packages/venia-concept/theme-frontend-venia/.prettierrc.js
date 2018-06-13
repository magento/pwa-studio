const defaults = {
    bracketSpacing: true,
    jsxBracketSameLine: false,
    printWidth: 80,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false
};

const overrides = {
    singleQuote: true,
    tabWidth: 4
};

module.exports = Object.assign({}, defaults, overrides);
