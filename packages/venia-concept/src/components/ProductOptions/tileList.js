import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Tile from './tile';
import defaultClasses from './tileList.css';

class TileList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        return <List renderItem={Tile} {...this.props} />;
    }
}

export default classify(defaultClasses)(TileList);
