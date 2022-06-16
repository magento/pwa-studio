import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePrintPdfContext } from '../PrintPdfProvider/printPdfProvider';
import { FormattedMessage } from 'react-intl';

function DropzoneComponent(props) {
    const { setFiles } = usePrintPdfContext();

    const onDrop = useCallback(acceptedFiles => {
        let reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onload = function(e) {
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: e.target.result
                    })
                )
            );
        };
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
        }),
        [isDragActive, isDragReject, isDragAccept]
    );

    return (
        <section>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <FormattedMessage id={'drag&DropMessage'} defaultMessage={'Drag and drop your images here'} />
            </div>
        </section>
    );
}

export default DropzoneComponent;

const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    transition: 'border .3s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
