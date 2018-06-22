import { Component, createElement } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Product from './product';
import defaultClasses from './productList.css';

class ProductList extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(
            shape({
                id: string.isRequired
            })
        ).isRequired
    };

    render() {
        return <List render="ul" renderItem={Product} {...this.props} />;
    }
}

export default classify(defaultClasses)(ProductList);
