import React, { Component} from 'react';
import { string, func, object, shape } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './productEdit.css';
import ProductOptions from 'src/components/ProductOptions';
import OptionsHeader from 'src/components/ProductOptions/optionsHeader';

class ProductEdit extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            colors: string,
            header: string
        }),
        item: object.isRequired,
        onOptionChange: func.isRequired
    };

    mapData = (configurableOptions) => {
        const productOptions = configurableOptions.map((option) => {
            const options = option.values.map((value) => {
                return {
                    item: {
                        // TODO: Change backgroundColor to swatch_color
                        backgroundColor: value.label,
                        label: value.label,
                        value_index: value.value_index,
                        attributeCode: option.attribute_code,
                        isDisabled: value.isDisabled
                    },
                    children: value.label,
                    attributeCode: option.attribute_code
                }
            })
            return {
                attributeCode: option.attribute_code,
                items: options,
                position: option.position,
                label: option.label
            }
        });
        return productOptions;
    }

    // TODO: Use spread operator to create props object
    optionsComponent = (option, index) => {
        const props = {
            key: index,
            title: option.label,
            helpClick: () => { window.alert('hello')},
            attributeCode: option.attributeCode,
        }
        if ( option.attribute_code === 'size' ) {
            props.helpText = 'Size Guide';
        }
        return (
            <OptionsHeader
                {...props}
            >
                <ProductOptions
                    onSelect={this.props.onOptionChange}
                    options={option.items}/>
            </OptionsHeader>
        )
    }

    onProductChange = (data) => {
        const { onProductChange } = this.props;
        onProductChange(data);
    }

    render() {
        const { classes, item, onProductChange } = this.props;
        const mappedData = this.mapData(item.configurable_options);
        return (
            <div
                onChange={onProductChange}
                className={classes.root}>
                <div className={classes.colors}>
                    {mappedData.map( (option, index) => {
                        return this.optionsComponent(option, index);
                    })}
                </div>
            </div>
        )
    }
}

export default classify(defaultClasses)(ProductEdit);
