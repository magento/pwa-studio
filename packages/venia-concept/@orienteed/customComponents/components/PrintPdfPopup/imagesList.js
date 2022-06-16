import React, { useEffect, useRef } from 'react';
import { usePrintPdfContext } from '../PrintPdfProvider/printPdfProvider';

const imagesList = () => {
    const { files } = usePrintPdfContext();
    const imageRef = useRef();

    const thumbs = files.map(file => (
        <div key={file.name} ref={imageRef}>
            <img src={file.preview} alt={file.name} />
        </div>
    ));

    useEffect(
        () => () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return <aside>{thumbs}</aside>;
};

export default imagesList;
