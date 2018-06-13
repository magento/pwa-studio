import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import ListItem from './item';

class Items extends Component {
    static propTypes = {
        items: PropTypes.oneOfType([
            PropTypes.instanceOf(Map),
            PropTypes.arrayOf(PropTypes.array)
        ]).isRequired,
        renderItem: PropTypes.func
    };

    render() {
        const { items, renderItem } = this.props;

        return Array.from(items, ([key, item]) => (
            <ListItem key={key} render={renderItem} item={item} />
        ));
    }
}

export default Items;
