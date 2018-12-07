import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import { imageItemPropType } from './constants';
import Thumbnail from './thumbnail';
import defaultClasses from './thumbnailList.css';

class ThumbnailList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(imageItemPropType).isRequired,
        getItemKey: PropTypes.func,
        activeItemSrc: PropTypes.string,
        updateActiveItemIndex: PropTypes.func
    };

    findItemIndexBySrc = src =>
        this.props.items.findIndex(image => image.file === src);

    updateActiveItemHandler = newActiveItemSrc => {
        const newActiveItemIndex = this.findItemIndexBySrc(newActiveItemSrc);
        this.props.updateActiveItemIndex(newActiveItemIndex);
    };

    render() {
        const { items, getItemKey, activeItemSrc, classes } = this.props;

        return (
            <List
                items={items}
                renderItem={props => (
                    <Thumbnail
                        {...props}
                        activeItemSrc={activeItemSrc}
                        onClickHandler={this.updateActiveItemHandler}
                    />
                )}
                getItemKey={getItemKey}
                classes={classes}
            />
        );
    }
}

export default classify(defaultClasses)(ThumbnailList);
