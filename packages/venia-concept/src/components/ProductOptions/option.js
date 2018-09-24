import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './option.css';

class Option extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        item: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            text: PropTypes.string,
            isDisabled: PropTypes.bool,
            isSelected: PropTypes.bool
        })
    };

    render() {
        const { classes, item } = this.props;
        const { id, name, isSelected, opts } = item;
        const style = { '--background-color': id };

        const buttonClasses = isSelected ? `${classes.root} ${classes.selected}` : classes.root;

        return (
			<button
				className={buttonClasses}
				title={name}
				style={style}
				onClick={this.handleClick}
				{...opts}
            > <div> {this.props.children} </div> </button>
        );
    }

    handleClick = () => {
        console.log('clicked');
    };
}

export default classify(defaultClasses)(Option);
