import React from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import CourseContent from '../CourseContent';
import { useLearningRoute } from '@magento/peregrine/lib/talons/Lms/useLearningRoute';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Redirect } from 'react-router-dom';

const CourseMiddleware = () => {
    const talonProps = useLearningRoute();
    const [{ isSignedIn }] = useUserContext();
    const { userCoursesIdList, setUserCoursesIdList, setMarkAsDoneListQty, courses } = talonProps;
    const { courseId } = useParams();
    console.log({ talonProps });
    return isSignedIn ? (
        <CourseContent
            courseId={courseId}
            courses={courses}
            userCoursesIdList={userCoursesIdList}
            setUserCoursesIdList={setUserCoursesIdList}
            setMarkAsDoneListQty={setMarkAsDoneListQty}
        />
    ) : (
        <Redirect to={'/sign-in'} />
    );
};

export default CourseMiddleware;
