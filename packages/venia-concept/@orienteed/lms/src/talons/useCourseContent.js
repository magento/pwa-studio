import { useState, useEffect } from 'react';

import getCourseContent from '@orienteed/lms/services/courses/getCourseContent';
import getCourseDetails from '@orienteed/lms/services/courses/getCourseDetails';
import enrollUser from '@orienteed/lms/services/enrollment/enrollUser';
import unEnrollUser from '@orienteed/lms/services/enrollment/unEnrollUser';

export const useCourseContent = props => {
    const { userCoursesIdList, setUserCoursesIdList, courseId, isEnrolled } = props;

    const [courseDetails, setCourseDetails] = useState();
    const [courseContent, setCourseContent] = useState();
    const [enrolled, setEnrolled] = useState(isEnrolled);
    const [courseNotFound, setCourseNotFound] = useState(false);

    useEffect(() => {
        getCourseDetails(courseId).then(reply => setCourseDetails(reply.courses[0]));
    }, [courseId]);

    useEffect(() => {
        getCourseContent(courseId, enrolled).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') && reply.errorcode === 'invalidrecord' && setCourseNotFound(true)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const handleEnrollInCourse = () => {
        enrollUser(courseId).then(reply => (reply ? setEnrolled(true) : null));
        setUserCoursesIdList(prevState => [...prevState, parseInt(courseId)]);
        getCourseContent(courseId, true).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') && reply.errorcode === 'invalidrecord' && setCourseNotFound(true)
        );
        setEnrolled(true);
    };

    const handleUnenrollFromCourse = () => {
        unEnrollUser(courseId).then(reply => (reply ? setEnrolled(false) : null));
        const userCoursesIdListUpdate = userCoursesIdList.filter(value => {
            return value !== parseInt(courseId) ? value : null;
        });
        setUserCoursesIdList(userCoursesIdListUpdate);
        getCourseContent(courseId, false).then(reply =>
            Array.isArray(reply)
                ? setCourseContent([...reply])
                : reply.hasOwnProperty('errorcode') && reply.errorcode === 'invalidrecord' && setCourseNotFound(true)
        );
        setEnrolled(false);
    };

    return { courseDetails, courseContent, enrolled, handleEnrollInCourse, handleUnenrollFromCourse, courseNotFound };
};
