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
            backgroundColor: PropTypes.string,
            name: PropTypes.string,
            text: PropTypes.string,
            opts: PropTypes.object,
            isSelected: PropTypes.bool
        })
    };

    render() {
        const { classes, item, children } = this.props;
        const { backgroundColor, name, isSelected, opts } = item;
        const style = { '--background-color': backgroundColor };

        const buttonClasses = isSelected ? `${classes.root} ${classes.selected}` : classes.root;

        return (
			<button
				className={buttonClasses}
				title={name}
				style={style}
				onClick={this.handleClick}
				{...opts}
            >
                <span className={classes.childrenContainer}> <span className={classes.children}>{children}</span> </span>
                <div className={classes.overlay} />
            </button>
        );
    }

    handleClick = () => {
        console.log('clicked');
    };
}

export default classify(defaultClasses)(Option);
