import React, { Component} from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './productEdit.css';
import ProductOptions from 'src/components/ProductOptions';
import OptionsHeader from 'src/components/ProductOptions/optionsHeader';

class ProductEdit extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            colors: PropTypes.string,
            header: PropTypes.string
        }),
        item: PropTypes.object
    };

    mapData = (data) => {
        return data.map((item) => {
            const options = item.values.map((value) => {
                return {
                    item: {
                        // TODO: Change from label to mock
                        backgroundColor: value.label,
                        value: value.label,
                        value_index: value.value_index,
                        name: value.store_label,
                        onclick:() => console.log('swatch'),
                        attributeCode: item.attribute_code,
                        position: item.position,
                    },
                    children: value.label,
                    optionType: item.label
                }
            })
            return {
                attributeCode: item.attribute_code,
                label: item.label,
                items: options
            }
        });
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
                <div className={classes.header}>{item.name}</div>
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
