import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import getCourseContent from '@magento/peregrine/lib/RestApi/Lms/courses/getCourseContent';
import getCourseDetails from '@magento/peregrine/lib/RestApi/Lms/courses/getCourseDetails';
import enrollUser from '@magento/peregrine/lib/RestApi/Lms/enrollment/enrollUser';
import unEnrollUser from '@magento/peregrine/lib/RestApi/Lms/enrollment/unEnrollUser';

export const useCourseContent = props => {
    const {
        userCoursesIdList,
        setUserCoursesIdList,
        courseId,
        isEnrolled
    } = props;

    const history = useHistory();

    const [courseContent, setCourseContent] = useState();
    const [courseDetails, setCourseDetails] = useState();
    const [courseNotFound, setCourseNotFound] = useState(false);
    const [enrolled, setEnrolled] = useState(isEnrolled);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

    useEffect(() => {
        getCourseDetails(courseId).then(reply =>
            setCourseDetails(reply.courses[0])
        );
    }, [courseId]);

    useEffect(() => {
        getCourseContent(courseId, enrolled).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') &&
                  reply.errorcode === 'invalidrecord' &&
                  setCourseNotFound(true)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    useEffect(() => {
        setEnrolled(isEnrolled);
    }, [isEnrolled]);

    const handleEnrollInCourse = () => {
        enrollUser(courseId).then(reply => (reply ? setEnrolled(true) : null));
        setUserCoursesIdList(prevState => [...prevState, parseInt(courseId)]);
        getCourseContent(courseId, true).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') &&
                  reply.errorcode === 'invalidrecord' &&
                  setCourseNotFound(true)
        );
        setConfirmationModalOpen(false);
        setEnrolled(true);
    };

    const handleUnenrollFromCourse = () => {
        unEnrollUser(courseId).then(reply =>
            reply ? setEnrolled(false) : null
        );
        const userCoursesIdListUpdate = userCoursesIdList.filter(value => {
            return value !== parseInt(courseId) ? value : null;
        });
        setUserCoursesIdList(userCoursesIdListUpdate);
        history.push('/learning');
    };

    return {
        courseContent,
        courseDetails,
        courseNotFound,
        enrolled,
        handleEnrollInCourse,
        handleUnenrollFromCourse,
        isConfirmationModalOpen,
        setConfirmationModalOpen
    };
};
