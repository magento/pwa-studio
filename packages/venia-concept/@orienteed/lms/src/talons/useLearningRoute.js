import { useCallback, useState, useEffect } from 'react';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import getCourses from '../../services/getCourses';
import getUserCourses from '../../services/getUserCourses';

import OPERATIONS from '../graphql/getUserCourses.gql';

export const useLearningRoute = () => {
    const { getMoodleTokenAndIdQuery } = OPERATIONS;
    const fetchMoodleTokenAndId = useAwaitQuery(getMoodleTokenAndIdQuery);
    const [{ isSignedIn }] = useUserContext();
    const getAndSaveMoodleTokenAndId = useCallback(async () => {
        if (isSignedIn) {
            const responseData = await fetchMoodleTokenAndId();
            localStorage.setItem('LMS_INTEGRATION_moodle_token', responseData.data.customer.moodle_token);
            localStorage.setItem('LMS_INTEGRATION_moodle_id', responseData.data.customer.moodle_id);
        }
    }, [fetchMoodleTokenAndId, isSignedIn]);

    const userMoodleToken = localStorage.getItem('LMS_INTEGRATION_moodle_token');
    const userMoodleId = localStorage.getItem('LMS_INTEGRATION_moodle_id');
    userMoodleToken !== null && userMoodleId !== null ? null : getAndSaveMoodleTokenAndId();

    const [courses, setCourses] = useState();
    const [userCourses, setUserCourses] = useState();
    const [userCoursesIdList, setUserCoursesIdList] = useState([]);
    const [userCoursesIdListQty, setUserCoursesIdListQty] = useState(0);
    const [markAsDoneListQty, setMarkAsDoneListQty] = useState([]);
    const [buttonSelected, setSelectedButton] = useState('all');

    useEffect(() => {
        if (isSignedIn) {
            getCourses().then(coursesData => setCourses(coursesData));
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            getUserCourses(userMoodleToken, userMoodleId).then(userCoursesData => setUserCourses(userCoursesData));
        }
    }, [userMoodleToken, userMoodleId, userCoursesIdListQty, markAsDoneListQty, isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            if (userCourses) {
                const userCoursesIds = userCourses.map(course => {
                    return course.id;
                });
                setUserCoursesIdList(userCoursesIds);
            }
        }
    }, [userCourses, isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            if (userCoursesIdList.length > userCoursesIdListQty) {
                setUserCoursesIdListQty(userCoursesIdList.length);
            } else if (userCoursesIdList.length < userCoursesIdListQty) {
                setUserCoursesIdListQty(userCoursesIdList.length);
            }
        }
    }, [userCoursesIdList.length, userCoursesIdListQty, isSignedIn]);

    return {
        userMoodleId,
        userMoodleToken,
        buttonSelected,
        setSelectedButton,
        courses,
        userCourses,
        userCoursesIdList,
        setUserCoursesIdList,
        setMarkAsDoneListQty
    };
};
