import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import SuggestedProduct from './suggestedProduct';
import classify from 'src/classify';

import defaultClasses from './suggestedProducts.css';

class SuggestedProducts extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            items: PropTypes.string,
            title: PropTypes.string,
            titleText: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object).isRequired,
        handleOnProductOpen: PropTypes.func.isRequired
    };

    render() {
        const { classes, items, handleOnProductOpen } = this.props;
        return (
            <div className={classes.root}>
                <h4 className={classes.title}>
                    <span className={classes.titleText}>
                        Product Suggestions
                    </span>
                </h4>
                <List
                    render="ul"
                    className={classes.items}
                    items={items}
                    getItemKey={item => item.id}
                    renderItem={props => (
                        <SuggestedProduct
                            handleOnProductOpen={handleOnProductOpen}
                            {...props.item}
                        />
                    )}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(SuggestedProducts);
