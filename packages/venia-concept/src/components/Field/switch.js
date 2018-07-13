import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

class Switch extends Component {
    static propTypes = {
        checked: PropTypes.bool,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        id: PropTypes.string,
        name: PropTypes.string,
        type: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    static defaultProps = {
        classes: {}
    };

    render() {
        const { classes, ...restProps } = this.props;

        return (
            <input
                {...restProps}
                className={classes.root}
                onChange={this.handleChange}
            />
        );
    }

    handleChange = event => {
        const { onChange } = this.props;
        const { checked, name, value } = event.target;

        if (onChange) {
            onChange(name, value, checked);
        }
    };
}

export default Switch;
