import { useState, useEffect, useRef } from 'react';

export const useDropZone = props => {
    const { setImagesValues } = props;

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [validFiles, setValidFiles] = useState([]);

    const modalImageRef = useRef();
    const modalRef = useRef();

    const fileInputRef = useRef();

    const dragOver = e => {
        e.preventDefault();
    };

    const dragEnter = e => {
        e.preventDefault();
    };

    const dragLeave = e => {
        e.preventDefault();
    };

    const fileDrop = e => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    };

    useEffect(() => {
        let filteredArray = selectedFiles.reduce((file, current) => {
            const x = file.find(item => item.name === current.name);
            if (!x) {
                return file.concat([current]);
            } else {
                return file;
            }
        }, []);
        setValidFiles([...filteredArray]);
        setImagesValues([...filteredArray]);
    }, [selectedFiles]);

    const openImageModal = file => {
        const reader = new FileReader();
        modalRef.current.style.display = 'block';
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            modalImageRef.current.style.backgroundImage = `url(${e.target.result})`;
        };
    };

    const closeModal = () => {
        modalRef.current.style.display = 'none';
        modalImageRef.current.style.backgroundImage = 'none';
    };

    const validateFile = file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
        if (validTypes.indexOf(file.type) === -1) {
            return false;
        }
        return true;
    };

    const fileSize = size => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const fileType = fileName => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    };

    const removeFile = name => {
        // find the index of the item
        // remove the item from array

        const validFileIndex = validFiles.findIndex(e => e.name === name);
        validFiles.splice(validFileIndex, 1);
        // update validFiles array
        setValidFiles([...validFiles]);
        const selectedFileIndex = selectedFiles.findIndex(e => e.name === name);
        selectedFiles.splice(selectedFileIndex, 1);
        // update selectedFiles array
        setSelectedFiles([...selectedFiles]);
    };

    const handleFiles = files => {
        for (let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                // add to the same array so we can display the name of the file
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
            } else {
                // add a new property called invalid
                files[i]['invalid'] = true;
                setErrorMessage('File type not permitted');
            }
        }
    };

    const fileInputClicked = () => {
        fileInputRef.current.click();
    };

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    };

    return {
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
        errorMessage: errorMessage,
        modalImageRef: modalImageRef,
        modalRef: modalRef,
        fileInputRef: fileInputRef,
        validFiles: validFiles
    };
};
