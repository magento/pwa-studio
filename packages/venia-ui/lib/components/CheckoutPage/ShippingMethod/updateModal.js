import React from 'react';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import { Modal } from '../../Modal';
import ShippingRadios from './shippingRadios';
import UpdateModalCancelButton from './updateModalCancelButton';
import UpdateModalCancelIconButton from './updateModalCancelIconButton';
import defaultClasses from './updateModal.css';

const UpdateModal = props => {
    const {
        handleCancel,
        handleSubmit,
        isLoading,
        isOpen,
        pageIsUpdating,
        selectedShippingMethod,
        shippingMethods
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    return (
        <Modal>
            <aside className={rootClass}>
                <Form className={classes.contents} onSubmit={handleSubmit}>
                    <div className={classes.header}>
                        <span className={classes.headerText}>
                            {'Edit Shipping Method'}
                        </span>
                        <UpdateModalCancelIconButton
                            className={classes.headerButton}
                            onClick={handleCancel}
                        />
                    </div>
                    <div className={classes.body}>
                        <ShippingRadios
                            isLoading={isLoading}
                            selectedShippingMethod={selectedShippingMethod}
                            shippingMethods={shippingMethods}
                        />
                    </div>
                    <div className={classes.footer}>
                        <UpdateModalCancelButton
                            className={classes.footerCancelButton}
                            onClick={handleCancel}
                        />
                        <Button
                            className={classes.footerSubmitButton}
                            priority="high"
                            type="submit"
                            disabled={pageIsUpdating}
                        >
                            {'Update'}
                        </Button>
                    </div>
                </Form>
            </aside>
        </Modal>
    );
};

export default UpdateModal;

UpdateModal.propTypes = {
    classes: shape({
        body: string,
        contents: string,
        footer: string,
        footerCancelButton: string,
        footerSubmitButton: string,
        header: string,
        headerButton: string,
        headerText: string,
        root: string,
        root_open: string
    }),
    handleCancel: func,
    handleSubmit: func,
    isOpen: bool,
    pageIsUpdating: bool,
    selectedShippingMethod: string,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    )
};
