import React, { useEffect } from 'react';
import { isRequired } from '../../util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';

const FileInput = ({ value, inputRef, styles, onChange, field, ...rest }) => {
    return (
        <input
            {...rest}
            className={styles.fileInput}
            name={field}
            id={field}
            onChange={onChange}
            type="file"
            ref={inputRef}
        />
    );
};

export default FileInput;
