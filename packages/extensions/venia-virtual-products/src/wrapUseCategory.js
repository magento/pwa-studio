const { GET_CATEGORY } = require('./category.gql');

module.exports = original => props => {
    const newProps = {
        ...props,
        operations: {
            getCategoryQuery: GET_CATEGORY
        }
    };

    return original(newProps);
};
