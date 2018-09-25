import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './productEdit.css';
import ProductOptions from 'src/components/ProductOptions';
import OptionsHeader from 'src/components/ProductOptions/optionsHeader';
import swatchClasses from '../ProductOptions/swatch.css';
import { tileItems } from 'src/components/ProductOptions/mock_data';

class ProductEdit extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            colors: PropTypes.string,
            header: PropTypes.string
        }),
        item: PropTypes.object
    };

    randColor = () => Math.floor(Math.random()*128);

    randomSwatchItem = () => {
        return {
            item: {
                backgroundColor: `${this.randColor()} ${this.randColor()} ${this.randColor()}`,
                name: 'Swatch',
                onclick: () => console.log('Swatch')
            },
            classes: swatchClasses
        }
    }



    render() {
        const { classes, item } = this.props;
        const swatchItems = [this.randomSwatchItem(), this.randomSwatchItem(), this.randomSwatchItem(), this.randomSwatchItem(), this.randomSwatchItem(), this.randomSwatchItem(), this.randomSwatchItem()];
        return (
			<div className={classes.root}>
                <div className={classes.header}>{item.name}</div>
                <div className={classes.colors}>
                    <OptionsHeader title='Choose a Size' />
                    <ProductOptions options={tileItems}/>
                    <OptionsHeader title='Choose a Color' />
                    <ProductOptions options={swatchItems}/>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(ProductEdit);
