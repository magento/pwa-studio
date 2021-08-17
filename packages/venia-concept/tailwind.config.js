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
    presets: [venia]
};

module.exports = config;
