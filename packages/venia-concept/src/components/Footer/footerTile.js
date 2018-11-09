import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './footerTile.css';
import { footerTilePropType } from './constants';

const iconAttrs = {
    width: 18,
    color: 'rgb(var(--venia-black))'
};

class FooterTile extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            body: PropTypes.string,
            title: PropTypes.string,
            iconContainer: PropTypes.string
        }),
        item: footerTilePropType
    };

    getHeaderTitle = () => {
        const {
            item: { headerTitle }
        } = this.props;
        const typeofHeaderTitle = typeof headerTitle;

        if (typeofHeaderTitle === 'function') {
            return headerTitle();
        } else if (typeofHeaderTitle === 'string') {
            return headerTitle;
        } else {
            throw new Error('Incorrect type of header title');
        }
    };

    render() {
        const {
            classes,
            item: { iconName, bodyText }
        } = this.props;

        return (
            <div className={classes.root}>
                <h2 className={classes.title}>
                    <span className={classes.iconContainer}>
                        <Icon name={iconName} attrs={iconAttrs} />
                    </span>
                    <span>{this.getHeaderTitle()}</span>
                </h2>
                <p className={classes.body}>
                    <span>{bodyText}</span>
                </p>
            </div>
        );
    }
}

export default classify(defaultClasses)(FooterTile);
