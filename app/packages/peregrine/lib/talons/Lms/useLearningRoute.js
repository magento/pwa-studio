import { useState, useEffect } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useModulesContext } from '../../context/modulesProvider';

import getCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getCourses';
import getUserCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getUserCourses';

export const useLearningRoute = () => {
    const [{ isSignedIn }] = useUserContext();
    const { enabledModules } = useModulesContext();
    const isEnabled = enabledModules?.lms?.isEnabled();

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
            getUserCourses().then(userCoursesData => setUserCourses(userCoursesData));
        }
    }, [userCoursesIdListQty, markAsDoneListQty, isSignedIn]);

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
        buttonSelected,
        courses,
        isEnabled,
        setMarkAsDoneListQty,
        setSelectedButton,
        setUserCoursesIdList,
        userCourses,
        userCoursesIdList
    };
};
