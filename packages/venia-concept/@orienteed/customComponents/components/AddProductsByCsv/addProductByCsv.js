import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Upload as UploadFileIcon } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';

import AddProductErrorPopup from './ErrorPopup/addProductErrorPopup';
import { useAddProductsByCSV } from '../../talons/useAddProductsByCSV';
import defaultClasses from './addProductByCsv.module.css';

const AddProductByCsv = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        csvErrorType,
        setCsvErrorType,
        csvSkuErrorList,
        setCsvSkuErrorList,
        isCsvDialogOpen,
        setIsCsvDialogOpen,
        handleCancelCsvDialog
    } = props;

    const { handleCSVFile } = useAddProductsByCSV({
        csvErrorType,
        setCsvErrorType,
        csvSkuErrorList,
        setCsvSkuErrorList,
        setIsCsvDialogOpen
    });

    return (
        <>
            <Button onClick={handleCSVFile} priority={'normal'}>
                {/* <Icon
                    size={16}
                    src={UploadFileIcon}
                    classes={{
                        icon: classes.loadFileIcon
                    }}
                /> */}
                <FormattedMessage id={'AddProductByCsv.orderUsingCSV'} defaultMessage={'CSV ORDER'} />
            </Button>
            <AddProductErrorPopup
                isOpen={isCsvDialogOpen}
                onCancel={handleCancelCsvDialog}
                errorMessage={csvSkuErrorList}
                errorType={csvErrorType}
            />
        </>
    );
};

export default AddProductByCsv;
