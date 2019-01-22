export const filterModes = {
    default: 'default',
    swatch: 'swatch'
};

export const filterRenderOptions = {
    fashion_color: {
        mode: filterModes.swatch,
        options: { showLabel: false, generateColor: true }
    },
    default: {
        mode: filterModes.default
    }
};
