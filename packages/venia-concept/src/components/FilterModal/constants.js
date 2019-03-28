export const filterModes = {
    default: 'default',
    swatch: 'swatch'
};

export const filterLayouts = {
    grid: 'grid',
    list: 'list'
};

export const filterRenderOptions = {
    fashion_color: {
        mode: filterModes.swatch,
        options: {
            layout: filterLayouts.grid,
            searchable: true
        }
    },
    default: {
        mode: filterModes.default,
        options: {}
    }
};
