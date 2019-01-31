import React, { Component } from 'react';
import { bool, node, shape, string } from 'prop-types';
import EditIcon from 'react-feather/dist/icons/edit-2';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './section.css';

// TODO: move these attributes to CSS.
const editIconAttrs = {
    color: 'black',
    width: 18
};
const EDIT_ICON = <Icon src={EditIcon} attrs={editIconAttrs} />;

class Section extends Component {
    static propTypes = {
        classes: shape({
            content: string,
            icon: string,
            label: string,
            root: string,
            summary: string
        }),
        label: node,
        showEditIcon: bool
    };

    render() {
        const {
            children,
            classes,
            label,
            showEditIcon,
            ...restProps
        } = this.props;

        const icon = showEditIcon ? EDIT_ICON : null;

        return (
            <button className={classes.root} {...restProps}>
                <span className={classes.content}>
                    <span className={classes.label}>
                        <span>{label}</span>
                    </span>
                    <span className={classes.summary}>{children}</span>
                    <span className={classes.icon}>{icon}</span>
                </span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Section);
