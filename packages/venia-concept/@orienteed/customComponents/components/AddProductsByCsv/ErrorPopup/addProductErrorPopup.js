import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './addProductErrorPopup.module.css';
import Dialog from '@magento/venia-ui/lib/components/Dialog';

const AddProductErrorPopup = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const { isOpen, onCancel, errorMessage, errorType } = props;

    const invalidFormat = formatMessage({
        id: 'csvOrderError.invalidFormat',
        defaultMessage: "Invalid file. Use a '.csv' file"
    });

    const invalidSku = formatMessage({
        id: 'csvOrderError.invalidSku',
        defaultMessage: 'Error processing some products:'
    });

    const invalidFields = formatMessage({
        id: 'csvOrderError.invalidFields',
        defaultMessage: 'There are invalid or missing fields'
    });

    return (
        <Dialog
            confirmTranslationId={'global.close'}
            confirmText="Close"
            isOpen={isOpen}
            onConfirm={onCancel}
            title="Error"
            isModal={true}
            shouldHideCancelButton={true}
        >
            <div className={classes.root}>
                {errorType === 'sku' && (
                    <div className={classes.errorBox}>
                        {invalidSku}
                        <ul>
                            {errorMessage.map(element => {
                                return <li key={element}>- {element}</li>;
                            })}
                        </ul>
                    </div>
                )}

                {errorType === 'format' && <div className={classes.errorBox}>{invalidFormat}</div>}

                {errorType === 'fields' && <div className={classes.errorBox}>{invalidFields}</div>}

                {errorType === 'loading' && (
                    <div className={classes.loadingRender}>
                        <div className={classes.ldsRoller}>
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                        <p>Loading...</p>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default AddProductErrorPopup;

AddProductErrorPopup.propTypes = {
    classes: shape({
        root: string
    }),
    isOpen: bool,
    onCancel: func
};
