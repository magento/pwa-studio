import React, { useMemo, useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './OrderIncidenceBtn.module.css';
import buttonClasses from '@magento/venia-ui/lib/components/Button/button.module.css';
import Popup from 'reactjs-popup';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Field from '@magento/venia-ui/lib/components/Field';
import { useIntl } from 'react-intl';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button/button';
import { FileUploader } from 'react-drag-drop-files';
import { Form } from 'informed';
import { useOrderIncidenceBtn } from '../../talons/OrderIncidence/useOrderIncidenceBtn';

const OrderIncidenceBtn = props => {
    const { orderNumber } = props;
    const classes = useStyle(defaultClasses, buttonClasses);
    const { formatMessage } = useIntl();
    const talonProps = useOrderIncidenceBtn({ orderNumber });
    const { isLoading, fileTypes, indices, files, handleSendOrderIncidencesEmail, setIndices, setFiles } = talonProps;

    const NameLabel = formatMessage({
        id: 'global.name',
        defaultMessage: 'Name'
    });
    const emailLabel = formatMessage({
        id: 'global.email',
        defaultMessage: 'Email'
    });

    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });

    const incidenceLabel = formatMessage({
        id: 'global.incidence',
        defaultMessage: 'Incidence'
    });

    const descriptionLabel = formatMessage({
        id: 'global.descriptionLabel',
        defaultMessage: 'description'
    });

    const incidenceHandler = () => {
        const defaultIndic = { des: '' };
        var tem = JSON.parse(JSON.stringify(indices));
        tem.push(defaultIndic);
        setIndices(tem);
    };

    const handleChange = (file, key) => {
        var temFiles = JSON.parse(JSON.stringify(files));

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            temFiles[key] = file;
            temFiles[key]['base64'] = reader.result;
            setFiles(temFiles);
        };
    };

    const indicesHtml = useMemo(() => {
        return indices.map((value, key) => {
            return (
                <div className={classes.incidenceRow}>
                    <div className={[classes.col75, classes.addDescr].join(' ')}>
                        <TextInput
                            field={'description[' + key + ']'}
                            validate={isRequired}
                            placeholder={'Write description here'}
                            initialValue={value.des}
                        />
                    </div>
                    <FileUploader
                        handleChange={file => {
                            handleChange(file, key);
                        }}
                        name={'image[' + key + ']'}
                        types={fileTypes}
                    />
                </div>
            );
        });
    }, [indices, classes, isRequired]);

    return (
        <div className={classes.OrderIncidenceDiv}>
            <Popup
                trigger={
                    <button type="button" className={[classes.OrderIncidenceBtn, classes.root].join(' ')}>
                        {'OrderIncidence'}
                    </button>
                }
                modal
                nested
            >
                {close => (
                    <Form className={classes.modal} onSubmit={handleSendOrderIncidencesEmail}>
                        <button className={classes.close} onClick={close}>
                            &times;
                        </button>
                        <div className={classes.header}>Order Incidence Form </div>
                        <div className={classes.content}>
                            <div className={classes.container}>
                                <div className={classes.row}>
                                    <div className={classes.col75}>
                                        <Field id="name" label={NameLabel}>
                                            <TextInput field="name" validate={isRequired} />
                                        </Field>
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.col75}>
                                        <Field id="email" label={emailLabel}>
                                            <TextInput field="email" validate={isRequired} />
                                        </Field>
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.col75}>
                                        <Field id="telephone" label={telephoneLabel}>
                                            <TextInput field="telephone" validate={isRequired} />
                                        </Field>
                                    </div>
                                </div>

                                <div className={classes.row}>
                                    <Field id="incidence" label={incidenceLabel}>
                                        {indicesHtml}
                                    </Field>
                                </div>

                                <div className={classes.row}>
                                    <div className={classes.col75}>
                                        <button
                                            type="button"
                                            id="add"
                                            className={[classes.button, classes.addBtn].join(' ')}
                                            onClick={() => incidenceHandler()}
                                        >
                                            <span>Add</span>
                                        </button>
                                        <div id="options" />
                                    </div>
                                </div>
                                <Button priority="high" type={'submit'} disabled={isLoading}>
                                    {'Submit'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Popup>
        </div>
    );
};

export default OrderIncidenceBtn;
