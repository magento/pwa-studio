import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './menuItem.css';

class MenuItem extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            item: PropTypes.string
        }),
        component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        title: PropTypes.node,
        badge: PropTypes.node
    };

    static defaultProps = {
        component: 'button'
    };

    render() {
        const {
            classes,
            component: ContainerComponent,
            title,
            badge,
            ...props
        } = this.props;

        return (
            <ContainerComponent {...props} className={classes.item}>
                {title}
                {badge}
            </ContainerComponent>
        );
    }
}

export default classify(defaultClasses)(MenuItem);
