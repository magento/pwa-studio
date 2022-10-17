import React from 'react';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch,
    useParams
} from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useLearningRoute } from '../../talons/useLearningRoute';

import CourseContent from '../CourseContent';
import CoursesCatalog from '../CoursesCatalog';

const LearningRoute = () => {
    const [{ isSignedIn }] = useUserContext();
    const talonProps = useLearningRoute();
    const {
        userMoodleId,
        userMoodleToken,
        buttonSelected,
        setSelectedButton,
        courses,
        userCourses,
        userCoursesIdList,
        setUserCoursesIdList,
        setMarkAsDoneListQty
    } = talonProps;

    return isSignedIn ? (
        <Router>
            <Switch>
                <Route path="/:lang*/learning">
                    <CoursesCatalog
                        buttonSelected={buttonSelected}
                        setSelectedButton={setSelectedButton}
                        courses={courses}
                        userCourses={userCourses}
                        userCoursesIdList={userCoursesIdList}
                    />
                </Route>
                <Route path="/:lang*/course/:courseId">
                    <CourseMiddleware
                        userMoodleId={userMoodleId}
                        userMoodleToken={userMoodleToken}
                        userCoursesIdList={userCoursesIdList}
                        setUserCoursesIdList={setUserCoursesIdList}
                        setMarkAsDoneListQty={setMarkAsDoneListQty}
                    />
                </Route>
            </Switch>
        </Router>
    ) : (
        <Redirect to={'/sign-in'} />
    );
};

const CourseMiddleware = props => {
    const {
        userMoodleId,
        userMoodleToken,
        userCoursesIdList,
        setUserCoursesIdList,
        setMarkAsDoneListQty
    } = props;
    const { courseId } = useParams();
    return (
        <CourseContent
            courseId={courseId}
            userMoodleId={userMoodleId}
            userMoodleToken={userMoodleToken}
            userCoursesIdList={userCoursesIdList}
            setUserCoursesIdList={setUserCoursesIdList}
            setMarkAsDoneListQty={setMarkAsDoneListQty}
        />
    );
};

export default LearningRoute;
