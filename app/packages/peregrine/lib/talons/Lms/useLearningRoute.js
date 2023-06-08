/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useModulesContext } from '../../context/modulesProvider';

import getCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getCourses';
import getUserCourses from '@magento/peregrine/lib/RestApi/Lms/courses/getUserCourses';

import { useHistory } from 'react-router-dom';

export const useLearningRoute = () => {
    const [{ isSignedIn }] = useUserContext();
    const { tenantConfig } = useModulesContext();
    const isEnabled = tenantConfig.lmsEnabled;

    const [courses, setCourses] = useState();
    const [userCourses, setUserCourses] = useState();
    const [userCoursesIdList, setUserCoursesIdList] = useState([]);
    const [userCoursesIdListQty, setUserCoursesIdListQty] = useState(0);
    const [markAsDoneListQty, setMarkAsDoneListQty] = useState([]);
    const [buttonSelected, setSelectedButton] = useState('all');

    const { push } = useHistory();
    useEffect(() => {
        if (isSignedIn) {
            getCourses()
                .then(coursesData => setCourses(coursesData))
                .catch(() => push('/'));
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            getUserCourses()
                .then(userCoursesData => setUserCourses(userCoursesData))
                .catch(() => push('/'));
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
