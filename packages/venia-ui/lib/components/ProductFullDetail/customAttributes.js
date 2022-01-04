import React, { useMemo } from 'react';
import { array, shape, string } from 'prop-types';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import defaultClasses from './customAttributes.module.css';

const storage = new BrowserPersistence();

const CustomAttributes = props => {
    const { customAttributes } = props;
    const classes = useStyle(defaultClasses, props.classes);

    // TODO: Get complete price data from GraphQl including currency
    const storeCurrency = storage.getItem('store_view_currency') || 'USD';

    // Remove attributes not visible on front
    const cleanAttributes = useMemo(() => {
        if (customAttributes.length === 0) {
            return [];
        }

        return customAttributes
            .filter(
                ({ attribute_metadata }) =>
                    attribute_metadata.is_visible_on_front === true
            )
            .sort(
                (a, b) =>
                    a.attribute_metadata.sort_order -
                    b.attribute_metadata.sort_order
            );
    }, [customAttributes]);

    const list = useMemo(() => {
        if (cleanAttributes.length === 0) {
            return [];
        }

        return cleanAttributes.map(
            ({
                selected_attribute_options,
                entered_attribute_value,
                attribute_metadata
            }) => {
                const key = attribute_metadata.uid;
                const attributeLabel = attribute_metadata.label;
                const {
                    ui_input_type: type,
                    is_html_allowed: isHtml
                } = attribute_metadata.ui_input;
                let attributeContent;

                if (entered_attribute_value?.value) {
                    attributeContent = entered_attribute_value.value;
                } else if (
                    selected_attribute_options?.attribute_option.length > 0
                ) {
                    attributeContent = selected_attribute_options.attribute_option
                        .map(option => {
                            return option.label;
                        })
                        .join(', ');
                }

                switch (type) {
                    case 'BOOLEAN': {
                        attributeContent = (
                            <div className={classes.attributeContent}>
                                {attributeContent}
                            </div>
                        );

                        break;
                    }

                    // TODO: Get correct data from GraphQl based on config time zone
                    case 'DATE': {
                        // Convert date to ISO-8601 format so Safari can also parse it
                        const isoFormattedDate = attributeContent.replace(
                            ' ',
                            'T'
                        );

                        attributeContent = (
                            <div className={classes.attributeContent}>
                                <FormattedDate
                                    value={isoFormattedDate}
                                    year="numeric"
                                    month="short"
                                    day="2-digit"
                                />
                            </div>
                        );

                        break;
                    }

                    // TODO: Get correct data from GraphQl based on config time zone
                    case 'DATETIME': {
                        // Convert date to ISO-8601 format so Safari can also parse it
                        const isoFormattedDate = attributeContent.replace(
                            ' ',
                            'T'
                        );

                        attributeContent = (
                            <div className={classes.attributeContent}>
                                <FormattedDate
                                    value={isoFormattedDate}
                                    year="numeric"
                                    month="short"
                                    day="2-digit"
                                />
                                {/* eslint-disable-next-line react/jsx-no-literals */}
                                {', '}
                                <FormattedTime value={isoFormattedDate} />
                            </div>
                        );

                        break;
                    }

                    case 'PRICE': {
                        // TODO: Get complete price data from GraphQl including currency
                        attributeContent = (
                            <div className={classes.attributeContent}>
                                <Price
                                    value={parseInt(attributeContent)}
                                    currencyCode={storeCurrency}
                                />
                            </div>
                        );

                        break;
                    }

                    // TODO: Get decoded wysiwyg widgets from GraphQl
                    default: {
                        if (isHtml) {
                            attributeContent = (
                                <RichContent
                                    classes={{
                                        root: classes.attributeContentHtml
                                    }}
                                    html={attributeContent}
                                />
                            );
                        } else {
                            attributeContent = (
                                <div className={classes.attributeContent}>
                                    {attributeContent}
                                </div>
                            );
                        }

                        break;
                    }
                }

                return (
                    <li key={key} className={classes.listItem}>
                        <div className={classes.attributeLabel}>
                            {attributeLabel}
                        </div>

                        {attributeContent}
                    </li>
                );
            }
        );
    }, [
        classes.attributeLabel,
        classes.listItem,
        classes.attributeContentHtml,
        classes.attributeContent,
        cleanAttributes,
        storeCurrency
    ]);

    if (list.length === 0) {
        return null;
    }

    return (
        <div className={classes.root}>
            <p className={classes.title}>
                <FormattedMessage
                    id={'customAttributes.title'}
                    defaultMessage={'Details'}
                />
            </p>
            <ul className={classes.list}>{list}</ul>
        </div>
    );
};

CustomAttributes.propTypes = {
    classes: shape({
        root: string,
        title: string,
        list: string,
        listItem: string,
        attributeLabel: string,
        attributeContent: string,
        attributeContentHtml: string
    }),
    customAttributes: array.isRequired
};

export default CustomAttributes;
