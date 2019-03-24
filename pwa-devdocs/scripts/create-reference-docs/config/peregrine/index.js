module.exports = [
    {
        target: 'peregrine/src/Price/Price.js'
    },
    {
        target: 'peregrine/src/List/list.js',
        overrides: {
            items: {
                required: true
            },
            render: {
                required: true
            }
        }
    }
];
