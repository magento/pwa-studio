import React from 'react';
import { useDropZone } from '../../talons/useDropZone';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../../css/dropZone.module.css';
import FileInput from '../FileInput';

const DropZone = props => {
    const { field, setImagesValues } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const {
        dragOver,
        dragEnter,
        dragLeave,
        fileDrop,
        fileType,
        fileSize,
        removeFile,
        openImageModal,
        closeModal,
        fileInputClicked,
        filesSelected,
        errorMessage,
        modalImageRef,
        modalRef,
        fileInputRef,
        validFiles
    } = useDropZone({ setImagesValues });

    return (
        <div className={classes.container}>
            <button type="button" className={classes.fileUploadBtn} onClick={fileInputClicked}>
                File Explorer
            </button>
            <div
                className={classes.dropContainer}
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
            >
                <div className={classes.dropMessage}>
                    <FileInput
                        value={validFiles}
                        inputRef={fileInputRef}
                        styles={classes}
                        onChange={filesSelected}
                        field={field}
                    />
                    <div className={classes.fileDisplayContainer}>
                        {validFiles.length > 0 ? (
                            validFiles.map((file, i) => (
                                <div className={classes.fileStatusBar} key={i}>
                                    <div>
                                        <div className={classes.fileTypeLogo} />
                                        <div className={classes.fileType}>{fileType(file.name)}</div>
                                        <span
                                            className={
                                                file.invalid ? (classes.fileName, classes.fileError) : classes.fileName
                                            }
                                            onClick={
                                                !file.invalid ? () => openImageModal(file) : () => removeFile(file.name)
                                            }
                                        >
                                            {file.name}
                                        </span>
                                        <span className={classes.fileSize}>({fileSize(file.size)})</span>
                                        {file.invalid ? (
                                            <span className={classes.fileErrorMessage}>({errorMessage})</span>
                                        ) : null}
                                    </div>
                                    <div className={classes.fileRemove} onClick={() => removeFile(file.name)} />
                                </div>
                            ))
                        ) : (
                            <div className={classes.uploadIcon} />
                        )}
                    </div>
                </div>
            </div>

            <div className={classes.modal} ref={modalRef}>
                <div className={classes.overlay} />
                <span className={classes.close} onClick={() => closeModal()}>
                    X
                </span>
                <div className={classes.modalImage} ref={modalImageRef} />
            </div>
        </div>
    );
};

export default DropZone;
