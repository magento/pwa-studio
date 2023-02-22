import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';

import Dialog from '../../../Dialog';
import Field from '../../../Field';
import TextArea from '../../../TextArea';
import TextInput from '../../../TextInput';

import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './savedCartPopup.module.css';

const SavedCartPopup = props => {
    const { isOpen, onCancel, handleSubmit, errorMessage, isError, shouldDisableAllButtons } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const cartNameLabel = (
        <>
            <FormattedMessage id={'mpsavecart.cartName'} defaultMessage={'Cart Name'} />
            <span className={classes.cartNameUniqueLabel}>
                <FormattedMessage id={'mpsavecart.mpsavecart'} defaultMessage={'( Must be unique )'} />
            </span>
        </>
    );

    const cartDescriptionLabel = formatMessage({
        id: 'mpsavecart.cartDescription',
        defaultMessage: 'Description'
    });

    const saveCartPopuptitle = formatMessage({
        id: 'saveCartPopuptitle.title',
        defaultMessage: 'Save Cart'
    });

    const containerClass = isError ? classes.saveCartname_error : classes.saveCartname;

    const nameTextInput = !isError ? (
        <TextInput field="mpsavecart_name" validate={isRequired} />
    ) : (
        <TextInput field="mpsavecart_name" validate={isRequired} message={errorMessage} />
    );

    return (
        <Dialog
            confirmTranslationId={'global.save'}
            confirmText="Save"
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={handleSubmit}
            title={saveCartPopuptitle}
            shouldDisableAllButtons={shouldDisableAllButtons}
        >
            <div className={classes.root}>
                <div className={containerClass}>
                    <Field id="mpsavecart-name" label={cartNameLabel}>
                        {nameTextInput}
                    </Field>
                </div>
                <div className={classes.saveCartDescription}>
                    <Field id="mpsavecart-description" label={cartDescriptionLabel}>
                        <TextArea field="mpsavecart_description" validate={isRequired} />
                    </Field>
                    <div className={classes.saveCartDescriptionNote}>
                        <FormattedMessage
                            id={'saveCartDescription.descriptionNote'}
                            defaultMessage={'Maximum number of characters must be between 1 and 255'}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default SavedCartPopup;

SavedCartPopup.propTypes = {
    classes: shape({
        root: string
    }),
    isOpen: bool,
    onCancel: func
};
