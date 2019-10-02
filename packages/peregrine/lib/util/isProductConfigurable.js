// TODO: Move/merge with product util in peregrine?
export const isProductConfigurable = product =>
    product.__typename === 'ConfigurableProduct';
