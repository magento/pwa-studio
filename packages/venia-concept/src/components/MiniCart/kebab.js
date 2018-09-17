import { Component, createElement } from 'react';

import classify from 'src/classify';
import defaultClasses from './kebab.css'

class Kebab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    render() {
        const { classes, item } = this.props;
        const toggleClass = this.state.isOpen ? classes.dropdown + ' ' + classes.active : classes.dropdown;

        return (
            <div className={classes.root}>
                <button
                    onClick={() => this.openDropdown()}
                    onBlur={() => this.closeDropdown()}
                >
                ...
                </button>
                <ul
                    className={toggleClass}
                    onFocus={() => this.openDropdown()} 
                    onBlur={() => this.closeDropdown()}
                >
                    <li>
                        <a href="/">Add to favorites</a>
                    </li>
                    <li>
                        <a href="/">Edit item</a>
                    </li>
                    <li>
                        <button
                            className={classes.buttonRemoveItem}
                            onClick={() => this.removeItem(item)}
                        >
                        Remove item
                        </button>
                    </li>
                </ul>
            </div>
        )
    }

    openDropdown = () => {
        this.setState({
            isOpen: true
        });
    }

    closeDropdown = () => {
        this.setState({
            isOpen: false
        })
    }

    removeItem = (item) => {
        this.props.removeItemFromCart(item);
    }
}

export default classify(defaultClasses)(Kebab);
