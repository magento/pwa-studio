/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-no-literals */

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDropzone } from 'react-dropzone';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './dropzone.module.css';

import plusIcon from './Icons/plus.svg';
import closeIcon from './Icons/close.svg';

const MAX_FILE_SIZE = 10000000;
const MAX_FILES_ACCEPTED = 6;

const Dropzone = props => {
    const { filesUploaded, setFilesUploaded, setDropzoneError } = props;
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
    const dragFileText = formatMessage({ id: 'csr.dragFile', defaultMessage: 'Drag a file here' });

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
        accept: acceptedFilesTypes
    });

    const deleteUploadedFile = file => {
        setFilesUploaded(prevAcceptedFiles => prevAcceptedFiles.filter(f => f.name !== file.name));
    };

    return (
        <section
            className={filesUploaded.length === 0 ? classes.dropzoneContainerEmpty : classes.dropzoneContainerFull}
            {...getRootProps({
                onClick: event => filesUploaded.length >= 6 && event.stopPropagation()
            })}
        >
            <input {...getInputProps({})} />
            {filesUploaded.length === 0 ? (
                <>
                    <img src={plusIcon} alt="Add" />
                    <p className={classes.dropzonePlaceholder}>{dragFileText}</p>
                </>
            ) : (
                filesUploaded.map(file => (
                    <div
                        className={classes.dropzoneItem}
                        key={file.name}
                        {...getRootProps({
                            onClick: event => event.stopPropagation()
                        })}
                    >
                        <p className={classes.dropzoneItemName}>{file.name}</p>
                        <div className={classes.dropzoneItemDataContainer}>
                            <p className={classes.dropzoneItemSize}>{Math.ceil(file.size / 1000)} KB</p>
                            <img
                                className={classes.dropzoneItemCloseButton}
                                src={closeIcon}
                                alt="Close icon"
                                onClick={() => deleteUploadedFile(file)}
                            />
                        </div>
                    </div>
                ))
            )}
        </section>
    );
};

export default Dropzone;
