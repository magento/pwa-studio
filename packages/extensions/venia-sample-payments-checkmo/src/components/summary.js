import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Edit2 as EditIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import defaultClasses from './summary.css';

const Summary = props => {
    const { onEdit } = props;

    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const paymentSummary = formatMessage({
        id: 'checkoutPage.paymentSummary',
        defaultMessage: 'Checkmo'
    });

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformation'}
                        defaultMessage={'Payment Information'}
                    />
                </h5>
                <LinkButton
                    className={classes.edit_button}
                    onClick={onEdit}
                    type="button"
                >
                    <Icon
                        size={16}
                        src={EditIcon}
                        classes={{ icon: classes.edit_icon }}
                    />
                    <span className={classes.edit_text}>
                        <FormattedMessage
                            id={'global.editButton'}
                            defaultMessage={'Edit'}
                        />
                    </span>
                </LinkButton>
            </div>
            <div className={classes.checkmo_details_container}>
                <span className={classes.payment_type}>
                    Check / Money Order
                </span>
                <span className={classes.payment_details}>
                    {paymentSummary}
                </span>
            </div>
        </div>
    );
};

export default Summary;
