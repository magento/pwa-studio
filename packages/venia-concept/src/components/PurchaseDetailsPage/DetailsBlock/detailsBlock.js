import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './detailsBlock.css';

class DetailsBlock extends Component {
    static propTypes = {
        rows: PropTypes.array,
        classes: PropTypes.shape({})
    };

    static defaultProps = {
        rows: []
    };

    render() {
        const { rows, classes } = this.props;

        return (
            <dl className={classes.root}>
                {rows.map(({ property, value }) => (
                    <Fragment key={property}>
                        <dt className={classes.property}>{property}</dt>
                        <dd className={classes.value}>{value}</dd>
                    </Fragment>
                ))}
            </dl>
        );
    }
}

export default classify(defaultClasses)(DetailsBlock);
