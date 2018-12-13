import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import memoize from '../util/unaryMemoize';
import iterable from '../validators/iterable';
import ListItem from './item';

const removeFocus = () => ({
    hasFocus: false
});

const updateCursor = memoize(index => () => ({
    cursor: index,
    hasFocus: true
}));

const updateSelection = memoize(key => (prevState, props) => {
    const { selectionModel } = props;
    let selection;

    if (selectionModel === 'radio') {
        selection = new Set().add(key);
    }

    if (selectionModel === 'checkbox') {
        selection = new Set(prevState.selection);

        if (selection.has(key)) {
            selection.delete(key);
        } else {
            selection.add(key);
        }
    }

    return { selection };
});

class Items extends Component {
    static propTypes = {
        getItemKey: PropTypes.func.isRequired,
        items: iterable.isRequired,
        renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        selectionModel: PropTypes.oneOf(['checkbox', 'radio'])
    };

    static defaultProps = {
        getItemKey: ({ id }) => id,
        selectionModel: 'radio'
    };

    state = {
        cursor: null,
        hasFocus: false,
        selection: new Set()
    };

    render() {
        const { getItemKey, items, renderItem } = this.props;
        const { cursor, hasFocus, selection } = this.state;

        const children = Array.from(items, (item, index) => {
            const key = getItemKey(item, index);

            return (
                <ListItem
                    key={key}
                    item={item}
                    itemIndex={index}
                    render={renderItem}
                    hasFocus={hasFocus && cursor === index}
                    isSelected={selection.has(key)}
                    onBlur={this.handleBlur}
                    onClick={this.getClickHandler(key)}
                    onFocus={this.getFocusHandler(index)}
                />
            );
        });

        return <Fragment>{children}</Fragment>;
    }

    syncSelection() {
        const { selection } = this.state;
        const { onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(selection);
        }
    }

    handleBlur = () => {
        this.setState(removeFocus);
    };

    getClickHandler = memoize(key => () => {
        this.setState(updateSelection(key), this.syncSelection);
    });

    getFocusHandler = memoize(index => () => {
        this.setState(updateCursor(index));
    });
}

export default Items;
