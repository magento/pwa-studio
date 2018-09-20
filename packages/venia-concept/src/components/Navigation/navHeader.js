import classify from 'src/classify';
import { Component, createElement } from 'react';
import defaultClasses from './navHeader.css';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Trigger from './trigger';

class NavHeader extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            header: PropTypes.string,
            title: PropTypes.string
        }),
        onBack: PropTypes.func
    };

    get backArrow() {
        const { onBack } = this.props;
        return onBack ? (
            <button onClick={onBack}>
                <Icon name="arrow-left" />
            </button>
        ) : null;
    }

    render() {
        const { classes, title } = this.props;
        const { backArrow } = this;

        return (
            <div className={classes.header}>
                {backArrow}
                <h2 className={classes.title}>
                    <span>{title}</span>
                </h2>
                <Trigger>
                    <Icon name="x" />
                </Trigger>
            </div>
        );
    }
}

export default classify(defaultClasses)(NavHeader);
