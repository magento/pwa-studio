import PropTypes from 'prop-types';

export const imageItemPropType = PropTypes.shape({
    label: PropTypes.string,
    position: PropTypes.number,
    disabled: PropTypes.bool,
    file: PropTypes.string.isRequired
});
