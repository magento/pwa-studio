import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './priceAlert.module.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';
import Button from '../../Button';

const PriceAlert = props => {
    const { onCancel, isOpen, onConfirm, selectedVarient } = props;

    const talonProps = useProductsAlert({
        initialValues: props.initialValues || {},
        selectProductSku: selectedVarient?.product?.sku
    });
    const { handleSubmitPriceAlert, formProps, setFormApi, isUserSignIn } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);

    const modalTitle = formatMessage({
        id: 'productAlerts.priceAlertModal',
        defaultMessage: `Stay tuned for any updates on this product's price!`
    });
    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe Price-Change Alerts now! Register your email address to be the first to know when our product has any changes in price. You are always updated to get product pricing goodness!'
    });
    const modalFooterText = formatMessage({
        id: 'productAlerts.modalFooterText',
        defaultMessage:
            '  Kindly notice that the back-in-stock email will be delivered only one time, and your email address will not be shared or published with anyone else.'
    });
    const notifyMeText = formatMessage({
        id: 'productAlert.NotifyMe',
        defaultMessage: 'Notify me'
    });
    // confirmTranslationId
    return (
        <>
            <Dialog
                getApi={setFormApi}
                formProps={formProps}
                confirmTranslationId={'global.save'}
                onCancel={onCancel}
                onConfirm={handleSubmitPriceAlert}
                isOpen={isOpen}
                title={modalTitle}
                confirmText={notifyMeText}
            >
                <p>{modalTextInfo}</p>
                <hr />

                <Field id="priceAlertFormEmail">
                    <TextInput
                        id="priceAlertFormEmail"
                        data-cy="priceAlertFormEmail-email"
                        field="email"
                        validate={!isUserSignIn && isRequired}
                    />
                </Field>

                <p>{modalFooterText}</p>
            </Dialog>
        </>
    );
};

export default PriceAlert;
