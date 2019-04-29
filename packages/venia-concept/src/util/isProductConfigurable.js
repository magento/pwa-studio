const isProductConfigurable = product =>
    product.__typename === 'ConfigurableProduct';

export default isProductConfigurable;
