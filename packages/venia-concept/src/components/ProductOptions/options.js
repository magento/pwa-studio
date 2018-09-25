import { Component, createElement } from 'react';
import classify from 'src/classify';
import defaultClasses from './options.css';
import PropTypes from 'prop-types';

import Option from './option';

class Options extends Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.object)
    };

    constructor(props) {
        super(props);
        this.state = {selected: 0};
    }


    select = (item) => {
        this.setState({
            selected: item.backgroundColor
        });
        console.log(id);
    }

    render() {
        const { options, classes } = this.props;
        const { select } = this;

        return (
            <div className={classes.root}>
                { options.map(
                    (option) => {
                        (option.item.backgroundColor === this.state.selected ) ?
                            option.item['isSelected'] = true :
                            option.item['isSelected'] = false
                        return <Option handleClick={select} key={option.id} {...option} />
                    })
                }
            </div>
        )
    }
}

export default classify(defaultClasses)(Options);
