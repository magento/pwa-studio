import { GET_CATEGORY } from './category.gql';

const wrapUseCategory = original => props => {
    const newProps = {
        ...props,
        operations: {
            getCategoryQuery: GET_CATEGORY
        }
    };

    return original(newProps);
};

export default wrapUseCategory;
