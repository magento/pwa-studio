const venia = {}
    mode: 'jit',
    purge: {
        content: ['./src/**/*.css'],
        extractors: [
            {
                extractor: content => content.match(matcher) || [],
                extensions: ['css']
            }
        ]
    },
    separator: '_'
};

const config = {
    mode: 'jit',
    purge: { /* ... */ },
    separator: '_',
    // if you created a theme, apply it here
    presets: [venia]
};

module.exports = config;
