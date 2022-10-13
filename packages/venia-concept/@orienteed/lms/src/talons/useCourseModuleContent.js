import { useState, useEffect } from 'react';
import getCourseModuleMedia from '@orienteed/lms/services/media/getCourseModuleMedia';

export const useCourseModuleContent = props => {
    const { courseModuleUri, courseModuleMimetype, completiondata, isEnrolled } = props;
    const [isDone, setIsDone] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseModuleUrl, setCourseModuleUrl] = useState('');

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

    return { isDone, setIsDone, isModalOpen, setIsModalOpen, courseModuleUrl };
};
