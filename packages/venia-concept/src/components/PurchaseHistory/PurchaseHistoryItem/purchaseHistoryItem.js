import React, { Component } from 'react';
import { number, shape, string, date } from 'prop-types';
import { Link } from 'react-router-dom';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './purchaseHistoryItem.css';
import { processDate } from './helpers';

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
            id: number,
            imageSrc: string,
            title: string,
            date: date,
            link: string
        })
    };

    render() {
        const {
            classes,
            item: { imageSrc, title, date, link }
        } = this.props;

        return (
            <Link className={classes.body} to={link}>
                <img
                    className={classes.image}
                    src={imageSrc}
                    alt="clothes"
                />
                <div className={classes.textBlock}>
                    <div className={classes.textBlockTitle}>{title}</div>
                    <div className={classes.textBlockDate}>{processDate(date)}</div>
                </div>
                <div className={classes.chevronContainer}>
                    <Icon name="chevron-right" />
                </div>
            </Link>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistoryItem);
