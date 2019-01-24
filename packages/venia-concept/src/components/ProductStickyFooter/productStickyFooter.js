import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './productStickyFooter.css';
import Icon from 'src/components/Icon';

const SUCCESS_STATE_LIFETIME = 3000;

class ProductStickyFooter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            addToCart: PropTypes.string,
            addToCartInProgress: PropTypes.string,
            addToCartSuccess: PropTypes.string,
            loadingContainer: PropTypes.string
        }),
        onAddToCart: PropTypes.func,
        addToCartError: PropTypes.bool,
        isAddingToCart: PropTypes.bool
    };

    state = {
        addToCartButtonSuccessState: false
    };

    componentWillUnmount() {
        clearTimeout(this.resetButtonTimer);
    }

    get getSuccessButtonData() {
        const { classes } = this.props;
        return {
            className: classes.addToCartSuccess,
            childNode: <Icon name="check" />
        };
    }

    get getInProgressButtonData() {
        const { classes } = this.props;
        return {
            className: classes.addToCartInProgress,
            childNode: (
                <Fragment>
                    <span className={classes.loadingDot_1} />
                    <span className={classes.loadingDot_2} />
                    <span className={classes.loadingDot_3} />
                </Fragment>
            )
        };
    }

    get getCartButtonData() {
        const { classes } = this.props;

        if (this.props.isAddingToCart) {
            return this.getInProgressButtonData;
        } else if (this.state.addToCartButtonSuccessState) {
            this.setTimerToResetState();
            return this.getSuccessButtonData;
        } else {
            return { childNode: 'Add to Cart', className: classes.addToCart };
        }
    }

    setTimerToResetState = () => {
        this.resetButtonTimer = setTimeout(() => {
            this.setState({ addToCartButtonSuccessState: false });
        }, SUCCESS_STATE_LIFETIME);
    };

    handleAddToCart = async () => {
        await this.props.onAddToCart();
        !this.props.addToCartError &&
            this.setState({ addToCartButtonSuccessState: true });
    };

    render() {
        const { classes } = this.props;
        const { childNode, className } = this.getCartButtonData;

        return (
            <div className={classes.root}>
                <button className={className} onClick={this.handleAddToCart}>
                    {childNode}
                </button>
            </div>
        );
    }
}

export default classify(defaultClasses)(ProductStickyFooter);
