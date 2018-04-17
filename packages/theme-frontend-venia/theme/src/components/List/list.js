import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from 'src/util/fromRenderProp';
import toMap from 'src/util/toMap';
import Items from './items';

class List extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        getItemKey: PropTypes.func,
        items: PropTypes.oneOfType([PropTypes.instanceOf(Map), PropTypes.array])
            .isRequired,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        renderItem: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    };

    static defaultProps = {
        classes: {},
        items: [],
        render: 'div',
        renderItem: 'div'
    };

    render() {
        const {
            classes,
            getItemKey,
            items,
            render,
            renderItem,
            ...restProps
        } = this.props;
        const customProps = { classes, items };
        const transformItem = (v, i) => [getItemKey(v, i), v];
        const itemsMap = toMap(items, transformItem);
        const Root = fromRenderProp(render, Object.keys(customProps));

        return (
            <Root className={classes.root} {...customProps} {...restProps}>
                <Items items={itemsMap} renderItem={renderItem} />
            </Root>
        );
    }
}

export default List;
