import PropTypes from 'prop-types';

export const footerTilePropType = PropTypes.shape({
    iconName: PropTypes.string,
    headerTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    bodyText: PropTypes.string
});
