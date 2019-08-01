import React, { Component, Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import classify from '../../classify';
import Icon from '../Icon';
import { ArrowLeft as ArrowLeftIcon, X as CloseIcon } from 'react-feather';
import Trigger from '../Trigger';
import defaultClasses from './navHeader.css';

class NavHeader extends Component {
    static propTypes = {
        classes: shape({
            title: string
        }),
        onBack: func.isRequired,
        onClose: func.isRequired
    };

    render() {
        const { classes, onBack, onClose, title } = this.props;

        return (
            <Fragment>
                <Trigger key="backButton" action={onBack}>
                    <Icon src={ArrowLeftIcon} />
                </Trigger>
                <h2 key="title" className={classes.title}>
                    <span>{title}</span>
                </h2>
                <Trigger key="closeButton" action={onClose}>
                    <Icon src={CloseIcon} />
                </Trigger>
            </Fragment>
        );
    }
}

export default classify(defaultClasses)(NavHeader);
