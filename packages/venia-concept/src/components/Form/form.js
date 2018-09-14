import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './form.css';
import classify from 'src/classify';

class Form extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
    };

    render() {
        const { classes, children } = this.props;
        return (
            <form className={classes.root} onSubmit={this.submitForm}>
                {children}
            </form>
        );
    }

    submitForm = event => {
        const { submitForm } = this.props;
        event.preventDefault();
        submitForm();
    };
}

export default classify(defaultClasses)(Form);
