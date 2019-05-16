import React  from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Thumbnail from './thumbnail';
import defaultClasses from './thumbnailList.css';

const ThumbnailList = ({
    activeItemIndex,
    updateActiveItemIndex,
    items,
    classes
}) => {
    return (
        <List
            items={items}
            renderItem={props => (
                <Thumbnail
                    {...props}
                    isActive={activeItemIndex === props.itemIndex}
                    onClickHandler={newActiveItemIndex =>
                        updateActiveItemIndex(newActiveItemIndex)
                    }
                />
            )}
            getItemKey={i => i.file}
            classes={classes}
        />
    );
};

ThumbnailList.propTypes = {
    activeItemIndex: PropTypes.number,
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
    updateActiveItemIndex: PropTypes.func.isRequired
};

export default classify(defaultClasses)(ThumbnailList);
