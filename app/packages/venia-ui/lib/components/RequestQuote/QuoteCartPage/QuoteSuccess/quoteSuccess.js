import React, { useMemo, useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './quoteSuccess.module.css';
import { Link, useLocation } from 'react-router-dom';

const QuoteSuccess = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const { pathname } = useLocation();
    const url = pathname.split('/');

    const [entityId, setEntityId] = useState();

    useEffect(() => {
        if (!url[4]) {
            history.push('/cart');
        } else {
            setEntityId(url[4]);
        }
    }, [url]);

    const convertedEntityId = useMemo(() => {
        if (entityId != undefined) {
            let length = 10;
            length -= parseInt(entityId.toString().length);

            let newLength = '';
            for (let i = 0; i < length; i++) {
                newLength += '0';
            }

            return newLength.concat(entityId.toString());
        }

        return null;
    }, [entityId]);

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'quoteSuccess.title',
                    defaultMessage: 'Thank you!'
                })}
            </StoreTitle>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>
                    <FormattedMessage id={'quoteSuccess.heading'} defaultMessage={'Thank you!'} />
                </h1>
            </div>
            <div className={classes.body}>
                <div className={classes.content}>
                    <p>
                        <FormattedMessage
                            id={'quoteSuccess.submitQuoteCartButton'}
                            defaultMessage={'You have submitted the quote request successfully. Your quote cart ID is '}
                        />
                        <strong>{convertedEntityId}</strong>
                        <br />
                        <FormattedMessage
                            id={'quoteSuccess.submitQuoteCartButton'}
                            defaultMessage={"Please wait for the store's response."}
                        />
                    </p>
                    <div className={classes.actions}>
                        <Link className={classes.continueShoppingBtn} to="/">
                            <FormattedMessage
                                id={'quoteSuccess.continueShoppingBtn'}
                                defaultMessage={'Continue Shopping'}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteSuccess;

QuoteSuccess.propTypes = {
    classes: shape({
        root: string
    })
};
