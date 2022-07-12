/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDropzone } from 'react-dropzone';

import { useCommonToasts } from '@magento/venia-ui/lib/components/Wishlist/AddToListButton/useCommonToasts';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './dropzone.module.css';

import plusIcon from './Icons/plus.svg';
import closeIcon from './Icons/close.svg';
const MAX_FILE_SIZE = 10000000;

const Dropzone = props => {
    const { filesUploaded, setFilesUploaded } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [errorFound, setErrorFound] = useState(null);

    const dragFileText = formatMessage({ id: 'csr.dragFile', defaultMessage: 'Drag a file here' });

    const acceptedFilesTypes = [
        'application/gzip',
        'application/pdf',
        'application/rar',
        'application/tar.gz',
        'application/zip',
        'audio/aac',
        'audio/mp3',
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

    const errorFilesToastProps = useEffect(() => {
        if (errorFound !== null) {
            let customMessage;
            if (errorFound[0].code === 'file_too_large') {
                customMessage = formatMessage({
                    id: 'csr.fileExceedsMaxSize',
                    defaultMessage: 'File exceeds maximum size of 10MB'
                });
            } else if (errorFound[0].code === 'file_too_many') {
                customMessage = formatMessage({
                    id: 'csr.maxFilesReached',
                    defaultMessage: 'Maximum number of files reached'
                });
            } else if (errorFound[0].code === 'file_invalid_type') {
                customMessage = formatMessage({
                    id: 'csr.fileTypeNotSupported',
                    defaultMessage: 'File type not supported'
                });
            } else if (errorFound[0].code === 'file_invalid_extension') {
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

            return {
                type: 'error',
                message: customMessage,
                timeout: 5000
            };
        }

        return null;
    }, [errorFound, formatMessage]);

    useCommonToasts({ errorFilesToastProps });

    const onDrop = useCallback(
        (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length > 0) {
                console.log(rejectedFiles);
                setErrorFound(rejectedFiles[0].errors);
                setErrorFound(null);
            }

            if (acceptedFiles.length > 0) {
                acceptedFiles.forEach(file => {
                    const reader = new FileReader();
                    setFilesUploaded(prevFilesUploaded => [
                        ...prevFilesUploaded,
                        {
                            name: file.name,
                            size: file.size,
                            mimeType: file.type,
                            content: reader.readAsDataURL(file)
                        }
                    ]);
                });
            }
        },

        [setFilesUploaded]
    );

    const deleteUploadedFile = file => {
        setFilesUploaded(prevAcceptedFiles => prevAcceptedFiles.filter(f => f.name !== file.name));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        maxFiles: 6,
        maxSize: MAX_FILE_SIZE,
        multiple: false,
        accept: acceptedFilesTypes
    });

    return (
        <section
            className={filesUploaded.length === 0 ? classes.dropzoneContainerEmpty : classes.dropzoneContainerFull}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
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
                            <p className={classes.dropzoneItemSize}>({Math.ceil(file.size / 1000)}KB)</p>
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
