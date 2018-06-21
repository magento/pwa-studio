import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Swatch from './swatch';
import defaultClasses from './swatchList.css';

class SwatchList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object)
    };

    render() {
        return <List renderItem={Swatch} {...this.props} />;
    }
}

export default classify(defaultClasses)(SwatchList);
