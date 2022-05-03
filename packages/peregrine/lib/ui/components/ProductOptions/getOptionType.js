const customAttributes = {
    fashion_color: 'swatch'
};

export default ({ attribute_code: code } = {}) => customAttributes[code];
