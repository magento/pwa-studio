import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Thumbnail from './thumbnail';
import defaultClasses from './thumbnailList.css';

class ThumbnailList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    render() {
        return <List renderItem={Thumbnail} {...this.props} />;
    }
}

export default classify(defaultClasses)(ThumbnailList);
