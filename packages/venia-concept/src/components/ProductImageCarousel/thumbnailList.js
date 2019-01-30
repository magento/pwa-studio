import React, { Component } from 'react';
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
        items: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                position: PropTypes.number,
                disabled: PropTypes.bool,
                file: PropTypes.string.isRequired
            })
        ).isRequired,
        updateActiveItemIndex: PropTypes.func
    };

    findItemIndexBySrc = src =>
        this.props.items.findIndex(image => image.file === src);

    updateActiveItemHandler = newActiveItemIndex => {
        this.props.updateActiveItemIndex(newActiveItemIndex);
    };

    render() {
        const { activeItemIndex, items, classes } = this.props;

        return (
            <List
                items={items}
                renderItem={props => (
                    <Thumbnail
                        {...props}
                        isActive={activeItemIndex === props.itemIndex}
                        onClickHandler={this.updateActiveItemHandler}
                    />
                )}
                getItemKey={i => i.file}
                classes={classes}
            />
        );
    }
}

export default classify(defaultClasses)(ThumbnailList);
