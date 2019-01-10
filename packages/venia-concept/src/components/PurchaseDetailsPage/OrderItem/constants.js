import PropTypes from 'prop-types';

export const itemPropType = PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    qty: PropTypes.number,
    titleImageSrc: PropTypes.string,
    price: PropTypes.number,
    sku: PropTypes.string
});
