import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import SwatchList from './swatchList';
import TileList from './tileList';
import defaultClasses from './option.css';

const optionTypes = ['color', 'string'];

class Option extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        name: PropTypes.node.isRequired,
        type: PropTypes.oneOf(optionTypes).isRequired,
        values: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    static defaultProps = {
        type: 'string'
    };

    get listComponent() {
        return this.props.type === 'color' ? SwatchList : TileList;
    }

    render() {
        const { classes, name, values } = this.props;
        const ValueList = this.listComponent;

        return (
            <div className={classes.root}>
                <h3 className={classes.title}>
                    <span>{name}</span>
                </h3>
                <ValueList items={values} />
            </div>
        );
    }
}

export default classify(defaultClasses)(Option);
