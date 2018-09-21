import { Component, createElement } from 'react';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './kebab.css'

class Kebab extends Component {

    constructor() {
        super();
        this.state = {
            isFavorite: false
        }
    }

    render() {
        const { classes, item, isOpen, onFocus, onBlur } = this.props;
        const toggleClass = isOpen ? classes.dropdown + ' ' + classes.active : classes.dropdown;
        const iconAttrs = {
              color: 'rgb(var(--venia-teal))',
              width: '16px',
              height: '16px'
        };
        const favAttrs = {
              color: 'rgb(var(--venia-teal))',
              width: '16px',
              height: '16px',
              fill: 'rgb(var(--venia-teal))'
        }

        return (
              <div className={classes.root} onFocus={onFocus} onBlur={onBlur}>
                <button className={classes.kebab}>
                  <Icon name='more-vertical' attrs={{color: 'rgb(var(--venia-teal))'}} />
                </button>
                <ul className={toggleClass} >
                    <li>
                      <button onClick={this.addItemToFavorites}>
                        <Icon name='heart' attrs={this.state.isFavorite ? favAttrs : iconAttrs} />
                        <span className={classes.text}>Add to favorites</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => this.editItem(item)}>
                        <Icon name='edit-2' attrs={iconAttrs} />
                        <span className={classes.text}>Edit item</span>
                      </button>
                    </li>
                    <li>
                      <button
                          className={classes.buttonRemoveItem}
                          onClick={() => this.removeItem(item)}
                      >
                        <Icon name='trash' attrs={iconAttrs} />
                        <span className={classes.text}>Remove item</span>
                      </button>
                    </li>
                </ul>
            </div>
        )
    }

    addItemToFavorites = () => {
        this.setState({
            isFavorite: true
        });
    }

    editItem = (item) => {
        this.props.showEditPanel(item);
    }

    removeItem = (item) => {
        this.props.removeItemFromCart(item);
    }
}

export default classify(defaultClasses)(Kebab);
