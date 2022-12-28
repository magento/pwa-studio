import { useState, useEffect } from 'react';
import getCourseModuleMedia from '@magento/peregrine/lib/RestApi/Lms/media/getCourseModuleMedia';

export const useCourseModuleContent = props => {
    const { courseModuleUri, courseModuleMimetype, completiondata, isEnrolled } = props;
    
    const [courseModuleUrl, setCourseModuleUrl] = useState('');
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isEnrolled && courseModuleUri) {
            getCourseModuleMedia(courseModuleUri)
                .then(response => response.arrayBuffer())
                .then(data => setCourseModuleUrl(URL.createObjectURL(new Blob([data], { type: courseModuleMimetype }))))
                .catch(err => console.error(err));
        }
    }, [isEnrolled, courseModuleUri, courseModuleMimetype]);

    useEffect(() => {
        completiondata?.state === 0 ? setIsDone(false) : setIsDone(true);
    }, [completiondata]);

    return {
        courseModuleUrl,
        isConfirmationModalOpen,
        isDone,
        isModalOpen,
        setConfirmationModalOpen,
        setIsDone,
        setIsModalOpen,
    };
};
