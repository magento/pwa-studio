import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import { Link } from 'react-router-dom';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './purchaseHistoryItem.css';
import { processDate } from './helpers';
import { PURCHASE_HISTORY_ITEM_PROP_TYPES } from '../PurchaseHistory/constants';

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
        item: shape(PURCHASE_HISTORY_ITEM_PROP_TYPES).isRequired
    };

    render() {
        const { classes, item } = this.props;
        const { imageSrc, title, date, url } = item || {};

        return (
            <Link className={classes.body} to={url}>
                <img className={classes.image} src={imageSrc} alt="item" />
                <div className={classes.textBlock}>
                    <div className={classes.textBlockTitle}>{title}</div>
                    <div className={classes.textBlockDate}>
                        {processDate(date)}
                    </div>
                </div>
                <div className={classes.chevronContainer}>
                    <Icon name="chevron-right" attrs={CHEVRON_ICON_ATTRS} />
                </div>
            </Link>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistoryItem);
