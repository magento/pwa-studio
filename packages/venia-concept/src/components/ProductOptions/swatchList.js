import React, { Component } from 'react';
import { arrayOf, object, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Swatch from './swatch';
import defaultClasses from './swatchList.css';

class SwatchList extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(object)
    };

    render() {
        return <List renderItem={Swatch} {...this.props} />;
    }
}

export default classify(defaultClasses)(SwatchList);
