import React, { Component } from 'react';
import { arrayOf, object, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Tile from './tile';
import defaultClasses from './tileList.css';

class TileList extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(object)
    };

    render() {
        return <List renderItem={Tile} {...this.props} />;
    }
}

export default classify(defaultClasses)(TileList);
