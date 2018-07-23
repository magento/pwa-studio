import { Component, createElement } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './control.css';

const specialInputTypes = ['select', 'textarea'];
const isInput = type => !specialInputTypes.includes(type);

class Control extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        name: string,
        type: string.isRequired
    };

    // static defaultProps = {
    //     type: 'text'
    // };

    get input() {
        const { classes, type, ...restProps } = this.props;
        const elementType = isInput(type) ? 'input' : type;
        const inputProps = {
            ...restProps,
            className: classes.input,
            type: isInput(type) ? type : null,
            onChange: this.handleChange
        };

        return createElement(elementType, inputProps);
    }

    render() {
        const { input, props } = this;
        const { classes } = props;

        return <span className={classes.root}>{input}</span>;
    }

    handleChange = event => {
        const { name, onChange } = this.props;
        const { value } = event.target;

        if (onChange) {
            onChange(name, value);
        }
    };
}

export default classify(defaultClasses)(Control);
