import { Component, Fragment, createElement } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { Price } from '@magento/peregrine';

import classify from 'src/classify';
import defaultClasses from './product.css';

class Product extends Component {
    static propTypes = {
        classes: shape({
            image: string,
            name: string,
            optionName: string,
            optionValue: string,
            options: string,
            price: string,
            quantity: string,
            quantityOperator: string,
            quantitySelect: string,
            root: string
        }),
        item: shape({
            name: string,
            options: arrayOf(
                shape({
                    name: string,
                    value: string
                })
            ),
            price: shape({
                regularPrice: shape({
                    amount: shape({
                        currency: string.isRequired,
                        value: number.isRequired
                    }).isRequired
                }).isRequired
            }).isRequired
        })
    };

    get options() {
        const { classes, item } = this.props;

        return item.options.map(({ name, value }) => (
            <Fragment key={name}>
                <dt className={classes.optionName}>{name}</dt>
                <dd className={classes.optionValue}>{value}</dd>
            </Fragment>
        ));
    }

    render() {
        const { options, props } = this;
        const { classes, item } = props;
        const amount = item.price.regularPrice.amount;

        return (
            <li className={classes.root}>
                <div className={classes.image} />
                <div className={classes.name}>{item.name}</div>
                <dl className={classes.options}>{options}</dl>
                <div className={classes.quantity}>
                    <select
                        className={classes.quantitySelect}
                        value="1"
                        readOnly
                    >
                        <option value="1">{'1'}</option>
                    </select>
                    <span className={classes.quantityOperator}>{'×'}</span>
                    <span className={classes.price}>
                        <Price
                            currencyCode={amount.currency}
                            value={amount.value}
                        />
                    </span>
                </div>
            </li>
        );
    }
}

export default classify(defaultClasses)(Product);
