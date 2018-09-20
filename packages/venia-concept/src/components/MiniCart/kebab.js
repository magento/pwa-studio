import { Component, createElement } from 'react';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './kebab.css'

class Kebab extends Component {

    render() {
        const { classes, item, isOpen } = this.props;
        const toggleClass = isOpen ? classes.dropdown + ' ' + classes.active : classes.dropdown;
        const iconAttrs = {
              color: 'rgb(var(--venia-teal))',
              width: '16px',
              height: '16px'
        };
        return (
              <div className={classes.root}>
                <button>
                  <Icon name='more-vertical' attrs={{color: 'rgb(var(--venia-teal))'}} />
                </button>
                <ul className={toggleClass} >
                    <li>
                      <button>
                        <div>
                          <Icon name='heart' attrs={iconAttrs} />
                          <span className={classes.text}>Add to favorites</span>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button>
                        <div>
                          <Icon name='edit-2' attrs={iconAttrs} />
                          <span className={classes.text}>Edit item</span>
                        </div>
                      </button>
                    </li>
                    <li>
                      <button
                          className={classes.buttonRemoveItem}
                          onClick={() => this.removeItem(item)}
                      >
                        <div>
                          <Icon name='trash' attrs={iconAttrs} />
                          <span className={classes.text}>Remove item</span>
                        </div>
                      </button>
                    </li>
                </ul>
            </div>
        )
    }

    removeItem = (item) => {
        this.props.removeItemFromCart(item);
    }
}

export default classify(defaultClasses)(Kebab);
