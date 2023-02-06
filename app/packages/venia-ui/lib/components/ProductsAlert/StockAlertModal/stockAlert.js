import React from 'react';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useIntl } from 'react-intl';
import defaultClasses from './stockAlert.module.css';
import { useStyle } from '../../../classify';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';

const StockAlert = props => {
    const { onCancel, isOpen, selectedVarient } = props;

    const talonProps = useProductsAlert({
        initialValues: props.initialValues || {},
        selectProductSku: selectedVarient?.product?.sku || selectedVarient,
        selectProductB2B: selectedVarient
    });

    const { submitStockAlert, formProps, isUserSignIn } = talonProps;
    console.log('selectedVarient', selectedVarient);
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const modalTitle = formatMessage({
        id: 'productAlerts.stockAlertModal',
        defaultMessage: `Stay tuned for any updates on this product's availability!`
    });

    const modalTextInfo = formatMessage({
        id: 'productAlerts.infoText',
        defaultMessage:
            'Subscribe  for product availability. Register your email address to be the first to know when our product has any changes in availability. You are always updated to get product availability!'
    });
    const modalFooterText = formatMessage({
        id: 'productAlerts.modalFooterText',
        defaultMessage:
            '  Kindly notice that the availability email will be delivered only one time, and your email address will not be shared or published with anyone else.'
    });
    return (
        <>
            <Dialog
                formProps={formProps}
                confirmTranslationId={'productAlerts.notifyMeText'}
                onCancel={onCancel}
                onConfirm={submitStockAlert}
                isOpen={isOpen}
                confirmText={'Notify me'}
                title={modalTitle}
            >
                <hr />
                <p>{modalTextInfo}</p>
                {!isUserSignIn && (
                    <Field id="email">
                        <TextInput field="email" validate={!isUserSignIn && isRequired} data-cy="email" />
                    </Field>
                )}
                <p>{modalFooterText}</p>
            </Dialog>
        </>
    );
};

export default StockAlert;
