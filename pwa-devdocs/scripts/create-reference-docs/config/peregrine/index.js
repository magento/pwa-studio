module.exports = [
    {
        target: 'peregrine/lib/Price/price.js',
        type: 'class'
    },
    {
        target: 'peregrine/lib/List/list.js',
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
        target: 'peregrine/lib/hooks/useEventListener.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useDropdown.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useWindowSize.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/useSearchParam.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/hooks/usePagination.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/Toasts/useToastContext.js',
        type: 'function'
    },
    {
        target: 'peregrine/lib/Toasts/useToasts.js',
        type: 'function'
    }
];
