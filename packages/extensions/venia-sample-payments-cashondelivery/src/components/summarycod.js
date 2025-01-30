import React from 'react';
import { func, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Edit2 as EditIcon } from 'react-feather';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import defaultClasses from './summary.module.css';

/**
 * The SummaryCod component of the Cash On Delivery payment method extension.
 */
const SummaryCod = props => {
    const { onEdit } = props;

    const classes = useStyle(defaultClasses, props.classes);

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
            <div className={classes.cod_details_container}>
                <span className={classes.payment_type}>
                    <FormattedMessage
                        id={'CashOnDelivery.paymentType'}
                        defaultMessage={'Cash On Delivery'}
                    />
                </span>
            </div>
        </div>
    );
};

export default SummaryCod;

SummaryCod.propTypes = {
    classes: shape({
        root: string,
        cod_details_container: string,
        edit_button: string,
        edit_icon: string,
        edit_text: string,
        heading_container: string,
        heading: string,
        payment_type: string
    }),
    onEdit: func
};
