import React from 'react';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useIntl } from 'react-intl';
import defaultClasses from './stockAlert.module.css';
import { useStyle } from '../../../classify';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const StockAlert = props => {
    const [{ isSignedIn }] = useUserContext();
    const { onCancel, isOpen, selectedVarient, formProps, onConfirm: submitStockAlert } = props;

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
                {!isSignedIn && (
                    <Field id="email">
                        <TextInput field="email" validate={!isSignedIn && isRequired} data-cy="email" />
                    </Field>
                )}
                <p>{modalFooterText}</p>
            </Dialog>
        </>
    );
};

export default StockAlert;
