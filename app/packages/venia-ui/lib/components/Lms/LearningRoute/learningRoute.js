import React from 'react';
import { Redirect } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useLearningRoute } from '@magento/peregrine/lib/talons/Lms/useLearningRoute';

import CoursesCatalog from '../CoursesCatalog';

const LearningRoute = () => {
    const [{ isSignedIn }] = useUserContext();
    const talonProps = useLearningRoute();
    const { buttonSelected, setSelectedButton, courses, isEnabled, userCourses, userCoursesIdList } = talonProps;

    return isSignedIn ? (
        <CoursesCatalog
            buttonSelected={buttonSelected}
            setSelectedButton={setSelectedButton}
            courses={courses}
            userCourses={userCourses}
            userCoursesIdList={userCoursesIdList}
            isEnabled={isEnabled}
        />
    ) : (
        <Redirect to={'/sign-in'} />
    );
};

export default LearningRoute;
