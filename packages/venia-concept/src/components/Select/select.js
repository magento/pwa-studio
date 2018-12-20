import React, { Component, Fragment } from 'react';
import { arrayOf, node, number, oneOfType, shape, string } from 'prop-types';
import { BasicSelect, Option, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import { Message } from 'src/components/Field';
import Icon from 'src/components/Icon';
import defaultClasses from './select.css';

const iconAttrs = {
    height: 18,
    width: 18
};

class Select extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        field: string.isRequired,
        fieldState: shape({
            value: string
        }),
        items: arrayOf(
            shape({
                label: string,
                value: oneOfType([number, string])
            })
        ),
        message: node
    };

    render() {
        const { classes, fieldState, items, message, ...rest } = this.props;
        const options = items.map(({ label, value }) => (
            <Option key={value} value={value}>
                {label || (value != null ? value : '')}
            </Option>
        ));

        return (
            <Fragment>
                <div className={classes.wrapper}>
                    <BasicSelect
                        {...rest}
                        fieldState={fieldState}
                        className={classes.input}
                    >
                        {options}
                    </BasicSelect>
                    <span className={classes.icon}>
                        <Icon name="chevron-down" attrs={iconAttrs} />
                    </span>
                </div>
                <Message fieldState={fieldState}>{message}</Message>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(Select);
