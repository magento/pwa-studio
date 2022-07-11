import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useDropzone } from 'react-dropzone';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './dropzone.module.css';

import plusIcon from './Icons/plus.svg';

const Dropzone = props => {
    const { filesUploaded, setFilesUploaded } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const dragFileText = formatMessage({ id: 'csr.dragFile', defaultMessage: 'Drag a file here' });

    const onDrop = useCallback(
        acceptedFiles => {
            acceptedFiles.forEach(file => {
                const reader = new FileReader();

                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');
                reader.onload = () => {
                    // Do whatever you want with the file contents
                    const binaryStr = reader.result;
                    console.log(binaryStr);
                };
                reader.readAsArrayBuffer(file);
            });
            setFilesUploaded(prevAcceptedFiles => [...prevAcceptedFiles, ...acceptedFiles]);
            console.log(acceptedFiles);
        },
        [setFilesUploaded]
    );

    // const { getRootProps, getInputProps } = useDropzone({
    //     accept: {
    //         'image/jpg': [],
    //         'image/jpeg': [],
    //         'image/png': [],
    //         'image/gif': [],
    //         'audio/mp3': [],
    //         'audio/wav': [],
    //         'audio/ogg': [],
    //         'audio/aac': [],
    //         'video/mp4': [],
    //         'video/avi': [],
    //         'video/mpeg': [],
    //         'document/pdf': [],
    //         'text/plain': [],
    //         'text/csv': [],
    //         'application/zip': [],
    //         'application/rar': [],
    //         'application/gzip': [],
    //         'application/tar.gz': []
    //     }
    // });

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
                    <div className={classes.dropzoneItem} key={file.name}>
                        <p className={classes.dropzoneItemName}>{file.name}</p>
                        <p className={classes.dropzoneItemSize}>({Math.ceil(file.size / 1000)}KB)</p>
                    </div>
                ))
            )}
        </section>
    );
};

export default Dropzone;
