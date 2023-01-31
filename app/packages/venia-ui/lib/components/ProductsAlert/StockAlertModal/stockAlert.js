import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './stockAlert.module.css';
import { useIntl } from 'react-intl';

const StockAlert = ({ onCancel, isOpen, onConfirm, formProps, isUserSignIn }) => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    const confirmButton = formatMessage({
        id: 'global.confirmButton',
        defaultMessage: 'Confirm'
    });
    const email = formatMessage({
        id: 'global.email',
        defaultMessage: 'Email'
    });
    const modalTitle = formatMessage({
        id: 'productAlerts.stockAlertModal',
        defaultMessage: `Stay tuned for any updates on this product's availability!`
    });
    return (
        <>
            <Dialog
                formProps={formProps}
                confirmTranslationId={'global.save'}
                onCancel={onCancel}
                onConfirm={onConfirm}
                isOpen={isOpen}
                confirmText={confirmButton}
                title={modalTitle}
            >
                {!isUserSignIn && (
                    <Field id="email" label={email}>
                        <TextInput field="email" validate={!isUserSignIn && isRequired} data-cy="email" />
                    </Field>
                )}
            </Dialog>
        </>
    );
};

export default StockAlert;
