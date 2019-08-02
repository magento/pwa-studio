import React, { Component } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';

import classify from '../../classify';
import getOptionType from './getOptionType';
import SwatchList from './swatchList';
import TileList from './tileList';
import defaultClasses from './option.css';

const getItemKey = ({ value_index }) => value_index;

class Option extends Component {

    constructor(props) {
        super(props);
        this.state = {optionSelection: null};
        this.valuesMap = new Map(
            this.props.values.map(
            value => [
                value.value_index,
                value.store_label
            ]
        )
        );
    }

    static propTypes = {
        attribute_id: string,
        attribute_code: string.isRequired,
        classes: shape({
            root: string,
            title: string
        }),
        label: string.isRequired,
        onSelectionChange: func,
        values: arrayOf(object).isRequired
    };

    handleSelectionChange = selection => {
        const { attribute_id, onSelectionChange } = this.props;

        if (onSelectionChange) {
            onSelectionChange(attribute_id, selection);
        }
        this.setState({optionSelection: selection});
    };

    get listComponent() {
        const { attribute_code, values } = this.props;

        // TODO: get an explicit field from the API
        // that identifies an attribute as a swatch
        const optionType = getOptionType({ attribute_code, values });

        return optionType === 'swatch' ? SwatchList : TileList;
    }

    render() {
        const { handleSelectionChange, listComponent: ValueList, props } = this;
        const { classes, label, values } = props;
        const selectedValue = this.state.optionSelection;
        return (
            <div className={classes.root}>
                <h3 className={classes.title}>
                    <span>{label}</span>
                </h3>
                <ValueList
                    getItemKey={getItemKey}
                    items={values}
                    onSelectionChange={handleSelectionChange}
                />
                <p className={classes.selection}>
                    {selectedValue?`Selected ${label} : ${this.valuesMap.get(Array.from(selectedValue).pop())}`:''}
                </p>
            </div>
        );
    }
}

export default classify(defaultClasses)(Option);
