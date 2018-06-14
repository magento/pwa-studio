import { Component, Fragment, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './product.css';

class Product extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
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
                    <span className={classes.price}>{item.price}</span>
                </div>
            </li>
        );
    }
}

export default classify(defaultClasses)(Product);
