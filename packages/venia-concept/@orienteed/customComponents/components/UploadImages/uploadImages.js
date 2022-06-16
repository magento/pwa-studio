import React from 'react';
import DropZone from './dropZone.js';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../../css/uploadImages.module.css';
import { useIntl } from 'react-intl';

const UploadImages = props => {
    const { field, form, setImagesValues } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    return (
        <div className={classes.container}>
            <label className={classes.title}>
                {formatMessage({ id: 'orderIncidences.images', defaultMessage: 'Images of the Incidence' })}
            </label>
            <div className={classes.content}>
                <DropZone field={field} form={form} setImagesValues={setImagesValues} />
            </div>
        </div>
    );
};

export default UploadImages;
