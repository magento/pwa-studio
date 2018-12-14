import React, { Component } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';

import classify from 'src/classify';
import Select from 'src/components/Select';
import mockData from './mockData';
import defaultClasses from './quantity.css';

class Quantity extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        items: arrayOf(
            shape({
                value: number
            })
        )
    };

    static defaultProps = {
        selectLabel: "product's quantity"
    };

    render() {
        const { classes, selectLabel, ...restProps } = this.props;

        return (
            <div className={classes.root}>
                <Select
                    {...restProps}
                    field="quantity"
                    aria-label={selectLabel}
                    items={mockData}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Quantity);
