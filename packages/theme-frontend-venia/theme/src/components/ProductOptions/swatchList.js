import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import List from 'src/components/List';
import Swatch from './swatch';
import defaultClasses from './swatchList.css';

const getItemKey = ({ id }) => id;

class SwatchList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        return (
            <List renderItem={Swatch} getItemKey={getItemKey} {...this.props} />
        );
    }
}

export default classify(defaultClasses)(SwatchList);
