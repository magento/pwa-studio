import { Component, createElement } from 'react';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './kebab.css'

class Kebab extends Component {

    render() {
        const { classes, isOpen, onFocus, onBlur, children } = this.props;
        const toggleClass = isOpen ? classes.dropdown + ' ' + classes.active : classes.dropdown;

        return (
              <div className={classes.root} onFocus={onFocus} onBlur={onBlur}>
                <button className={classes.kebab}>
                    <Icon name='more-vertical' attrs={{color: 'rgb(var(--venia-teal))'}} />
                </button>
                <ul className={toggleClass} >
                    {children}
                </ul>
            </div>
        )
        /*
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
            <button onClick={() => this.removeItem(item)}>
              <Icon name='trash' attrs={iconAttrs} />
              <span className={classes.text}>Remove item</span>
            </button>
          </li>
          */
    }
}

export default classify(defaultClasses)(Kebab);
