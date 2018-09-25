import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './productEdit.css';

class ProductEdit extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
        }),
        item: PropTypes.object
    };

    render() {
        const { classes, item } = this.props;
        console.log(item);
        return (
			<div className={classes.root}>
                <span>{item.name}</span>
            </div>
        );
    }
}

export default classify(defaultClasses)(ProductEdit);
