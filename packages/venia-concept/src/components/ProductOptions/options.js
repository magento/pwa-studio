import { Component, createElement } from 'react';
import classify from 'src/classify';
import defaultClasses from './options.css';
import PropTypes from 'prop-types';

import Option from './option';

class Options extends Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.object)
    };

    state = {selected: 0};

    select = (item) => {
        this.setState({
            selected: item.id
        });
        console.log(item);
    }

    render() {
        const { options, classes } = this.props;
        const { select } = this;
        return (
            <div className={classes.root}>
                { options.map(
                    (option, id) => {
                        (option.item.id === this.state.selected ) ?
                            option.item['isSelected'] = true :
                            option.item['isSelected'] = false
                        option.item['id'] = id;
                        return <Option handleClick={select} key={id} {...option} />
                    })
                }
            </div>
        )
    }
}

export default classify(defaultClasses)(Options);
