import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './priceAlert.module.css';
import { useIntl } from 'react-intl';

const PriceAlert = ({ onCancel, isOpen, onConfirm, formProps }) => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses);
    const confirmButton = formatMessage({
        id: 'global.confirmButton',
        defaultMessage: 'Confirm'
    });
    const modalTitle = formatMessage({
        id: 'productAlerts.priceAlertModal',
        defaultMessage: `Stay tuned for any updates on this product's price!`
    });
    return (
        <>
            {' '}
            <Dialog
                formProps={formProps}
                confirmTranslationId={'global.save'}
                onCancel={onCancel}
                onConfirm={onConfirm}
                isOpen={isOpen}
                confirmText={confirmButton}
                title={modalTitle}
            >
                <Field id="email" label={CompanyNameLabel}>
                    <TextInput field="email" validate={isRequired} data-cy="email" />
                </Field>
            </Dialog>
        </>
    );
};

export default PriceAlert;
