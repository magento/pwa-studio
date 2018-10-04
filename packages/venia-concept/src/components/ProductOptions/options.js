import classify from 'src/classify';
import defaultClasses from './options.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Option from './option';

class Options extends Component {
    static propTypes = {
        options: PropTypes.arrayOf(PropTypes.object)
    };

    state = {selected: 0};

    constrcutor() {
        this.styleOptions = {
            Color: swatchStyles,
            Size: tileStyles
        }
    }

    select = (item) => {
        this.setState({
            selected: item.id
        });
        const options = { };
        options[item.attributeCode] = {
            value: item.value,
            value_index: item.value_index,
            position: item.position
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
                        (option.item.id === this.state.selected ) ?
                            option.item['isSelected'] = true :
                            option.item['isSelected'] = false
                        return <Option handleClick={select} key={id} {...option} />
                    })
                }
            </div>
        )
    }
}

export default classify(defaultClasses)(Options);
