import React, { Component, Fragment } from 'react';
import { arrayOf, node, shape, string } from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './detailsBlock.css';

class DetailsBlock extends Component {
    static propTypes = {
        classes: shape({
            property: string,
            root: string,
            value: string
        }).isRequired,
        rows: arrayOf(
            shape({
                property: node,
                value: node
            })
        )
    };

    static defaultProps = {
        rows: []
    };

    render() {
        const { classes, rows } = this.props;

        const items = Array.from(rows, ({ property, value }) => (
            <Fragment key={property}>
                <dt className={classes.property}>{property}</dt>
                <dd className={classes.value}>{value}</dd>
            </Fragment>
        ));

        return <dl className={classes.root}>{items}</dl>;
    }
}

export default classify(defaultClasses)(DetailsBlock);
