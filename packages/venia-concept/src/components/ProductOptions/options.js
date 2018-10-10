import classify from 'src/classify';
import defaultClasses from './options.css';
import React, { Component } from 'react';
import { shape, arrayOf, string, object } from 'prop-types';
import Option from './option';

class Options extends Component {
    static propTypes = {
        options: arrayOf(
        shape({
            children: string,
            item: object.isRequired
        })
        )
    };

    state = {selected: null};

    select = (item) => {
        if ( this.state.selected === item.id ) {
            this.setState({
                selected: null
            });
        } else {
            this.setState({
                selected: item.id
            });
        }
        const options = { };
        options[item.attributeCode] = {
            label: item.label,
            value_index: item.value_index
        }
        this.props.onSelect(options);
    }

    render() {
        const { options, classes } = this.props;
        const { select } = this;
        return (
            <div className={classes.root}>
                { options.map(
                    (option, id) => {
                        option.item['id'] = id;
                        (option.item.id === this.state.selected ) ?  option.item['isSelected'] = true :
                            option.item['isSelected'] = false
                        return (
                            <Option
                                className={classes.option}
                                handleClick={select}
                                key={id} {...option} />
                        )
                    })
                }
            </div>
        )
    }
}

export default classify(defaultClasses)(Options);
