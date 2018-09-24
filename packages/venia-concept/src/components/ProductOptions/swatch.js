import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Option from './option';

import classify from 'src/classify';
import defaultClasses from './swatch.css';

class Swatch extends Component {
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
        return (
			<Option
				{...this.props}
            > </Option>
        );
    }

    handleClick = () => {
        console.log('clicked');
    };
}

export default classify(defaultClasses)(Swatch);
