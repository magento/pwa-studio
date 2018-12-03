import PropTypes from 'prop-types';

export const USER_PROP_TYPES = {
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    extension_attributes: PropTypes.shape({
        is_subscribed: PropTypes.bool
    })
};

export const ADDRESS_PROP_TYPES = {
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    postcode: PropTypes.string,
    telephone: PropTypes.string,
    country: PropTypes.string,
    city: PropTypes.string,
    street: PropTypes.arrayOf(PropTypes.string),
    region: PropTypes.shape({
        region: PropTypes.string
    })
};
