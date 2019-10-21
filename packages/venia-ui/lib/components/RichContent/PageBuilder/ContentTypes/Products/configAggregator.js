import { getAdvanced } from '../../utils';

export default node => {
    const forms = node.querySelectorAll('[data-product-sku]');
    return {
        skus: [...forms].map(form => form.getAttribute('data-product-sku')),
        ...getAdvanced(node)
    };
};
