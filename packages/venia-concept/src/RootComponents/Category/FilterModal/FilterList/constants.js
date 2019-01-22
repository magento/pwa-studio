export const filterModes = {
    default: 'default',
    swatch: 'swatch'
};

export const filterRenderOptions = {
    fashion_color: {
        mode: filterModes.swatch,
        options: { showLabel: false, generateColor: true }
    },
    fashion_size: {
        mode: filterModes.swatch,
        options: { showLabel: true }
    },
    default: {
        mode: filterModes.default
    }
};
