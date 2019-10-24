import { getAdvanced } from '../../utils';

export default (node, props) => {
    const forms = node.querySelectorAll('[data-product-sku]');
    let carouselConfig = {};

    if (props.appearance === 'carousel') {
        carouselConfig = {
            slideAll: node.getAttribute('data-slide-all') === 'true',
            autoplay: node.getAttribute('data-autoplay') === 'true',
            autoplaySpeed:
                parseInt(node.getAttribute('data-autoplay-speed')) || 0,
            infinite: node.getAttribute('data-infinite-loop') === 'true',
            arrows: node.getAttribute('data-show-arrows') === 'true',
            dots: node.getAttribute('data-show-dots') === 'true',
            centerMode: node.getAttribute('data-center-mode') === 'true',
            centerPadding: node.getAttribute('data-center-padding')
        };
    }

    return {
        skus: [...forms].map(form => form.getAttribute('data-product-sku')),
        ...carouselConfig,
        ...getAdvanced(node)
    };
};
