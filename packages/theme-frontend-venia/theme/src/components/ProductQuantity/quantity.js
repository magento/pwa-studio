import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Select from 'src/components/Select';
import mockData from './mockData';
import defaultClasses from './quantity.css';

class Quantity extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            inventory: PropTypes.string,
            root: PropTypes.string
        })
    };

    state = {
        value: mockData[0].id
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <Select
                    items={mockData}
                    value={value}
                    onChange={this.handleChange}
                />
                <div className={classes.inventory}>
                    <span>17 Available</span>
                </div>
            </div>
        );
    }

    handleChange = value => {
        this.setValue(value);
    };

    setValue = value => {
        this.setState(() => ({ value }));
    };
}

export default classify(defaultClasses)(Quantity);
