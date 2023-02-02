/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-literals */

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDropzone } from 'react-dropzone';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './dropzone.module.css';

import attachFilesIcon from './Icons/attachFiles.svg';

const MAX_FILE_SIZE = 10000000;
const MAX_FILES_ACCEPTED = 6;

const Dropzone = props => {
    const { filesUploaded, setFilesUploaded, setDropzoneError, isTicketClosed } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const acceptedFilesTypes = [
        'application/gzip',
        'application/pdf',
        'application/rar',
        'application/tar.gz',
        'application/zip',
        'audio/aac',
        'audio/mpeg',
        'audio/ogg',
        'audio/wav',
        'image/gif',
        'image/jpeg',
        'image/png',
        'text/csv',
        'text/plain',
        'video/avi',
        'video/mp4',
        'video/mpeg'
    ];
    const { formatMessage } = useIntl();
    const [errorFound, setErrorFound] = useState(null);

    useEffect(() => {
        if (errorFound !== null && errorFound !== []) {
            let customMessage = '';
            let errorMessage = '';
            for (let index = 0; index < errorFound.length; index++) {
                const rejectedFile = errorFound[index];
                if (rejectedFile.errors[0].code === 'file-too-large') {
                    customMessage = formatMessage({
                        id: 'csr.fileExceedsMaxSize',
                        defaultMessage: 'File exceeds maximum size of 10MB'
                    });
                    // setDropzoneError(customMessage);
                } else if (rejectedFile.errors[0].code === 'too-many-files') {
                    customMessage = formatMessage({
                        id: 'csr.maxFilesReached',
                        defaultMessage: 'Maximum number of files reached'
                    });
                } else if (rejectedFile.errors[0].code === 'file-invalid-type') {
                    customMessage = formatMessage({
                        id: 'csr.fileTypeNotSupported',
                        defaultMessage: 'File type not supported'
                    });
                } else if (rejectedFile.errors[0].code === 'file-invalid-extension') {
                    customMessage = formatMessage({
                        id: 'csr.fileExtensionNotSupported',
                        defaultMessage: 'File extension not supported'
                    });
                } else {
                    customMessage = formatMessage({
                        id: 'csr.somethingWrong',
                        defaultMessage: 'Something went wrong with the file you tried to upload.'
                    });
                }

                errorMessage = errorMessage + rejectedFile.file.name + ': ' + customMessage;

                if (index < errorFound.length - 1) {
                    errorMessage = errorMessage + '\n';
                }
                setDropzoneError(errorMessage);
            }
        }
    }, [formatMessage, setDropzoneError, errorFound]);

    const onDrop = useCallback(
        (attachedFiles, rejectedFiles) => {
            setDropzoneError('');

            if (rejectedFiles.length > 0) {
                setErrorFound(rejectedFiles);
            }

            if (attachedFiles.length > 0) {
                attachedFiles.map(file => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = e => {
                        setFilesUploaded(prevFilesUploaded => [
                            ...prevFilesUploaded,
                            {
                                name: file.name,
                                size: file.size,
                                mimeType: file.type,
                                content: e.target.result.split(',')[1]
                            }
                        ]);
                    };
                });
            }
        },

        [setFilesUploaded, setDropzoneError]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: MAX_FILES_ACCEPTED,
        maxSize: MAX_FILE_SIZE,
        multiple: true,
        accept: acceptedFilesTypes,
        noDrag: true
    });

    return (
        <section
            {...getRootProps({
                onClick: event => (filesUploaded.length >= 6 || isTicketClosed) && event.stopPropagation()
            })}
        >
            <input {...getInputProps({})} />
            <img src={attachFilesIcon} className={isTicketClosed ? classes.attachFilesIconDisabled : classes.attachFilesIcon} alt="Attach" />
        </section>
    );
};

export default Dropzone;
