import React, { Component } from 'react';
import { number, oneOfType, shape, string } from 'prop-types';
import { Link, resourceUrl } from '@magento/venia-drivers';

import Icon from '../../Icon';
import { ChevronRight as ChevronRightIcon } from 'react-feather';

import classify from '../../../classify';
import defaultClasses from './purchaseHistoryItem.css';
import { processDate } from './helpers';

const CHEVRON_ICON_ATTRS = {
    width: 18,
    'stroke-width': 2
};

class PurchaseHistoryItem extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            textBlock: string,
            textBlockTitle: string,
            textBlockDate: string,
            chevronContainer: string
        }),
        item: shape({
            id: number.isRequired,
            imageSrc: string.isRequired,
            title: string.isRequired,
            date: oneOfType([number, string]),
            url: string
        }).isRequired
    };

    render() {
        const { classes, item } = this.props;
        const { imageSrc, title, date, url } = item || {};

        return (
            <Link className={classes.body} to={resourceUrl(url)}>
                <img className={classes.image} src={imageSrc} alt="item" />
                <div className={classes.textBlock}>
                    <div className={classes.textBlockTitle}>{title}</div>
                    <div className={classes.textBlockDate}>
                        {processDate(date)}
                    </div>
                </div>
                <div className={classes.chevronContainer}>
                    <Icon src={ChevronRightIcon} attrs={CHEVRON_ICON_ATTRS} />
                </div>
            </Link>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistoryItem);
