import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import fromRenderProp from 'src/util/fromRenderProp';

class Item extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        item: PropTypes.any.isRequired,
        render: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    };

    static defaultProps = {
        classes: {},
        render: 'div'
    };

    render() {
        const { classes, item, render, ...restProps } = this.props;
        const customProps = { classes, item };
        const Root = fromRenderProp(render, Object.keys(customProps));

        return (
            <Root className={classes.root} {...customProps} {...restProps}>
                {`${item}`}
            </Root>
        );
    }
}

export default Item;
