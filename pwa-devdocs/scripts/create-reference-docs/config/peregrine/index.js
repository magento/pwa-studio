module.exports = [
    {
        target: 'peregrine/src/Price/Price.js',
        type: 'class'
    },
    {
        target: 'peregrine/src/List/list.js',
        type: 'class',
        overrides: {
            items: {
                required: true
            },
            render: {
                required: true
            }
        }
    },
    {
        target: 'peregrine/src/hooks/useEventListener.js',
        type: 'function'
    },
    {
        target: 'peregrine/src/hooks/useDropdown.js',
        type: 'function'
    }
];
