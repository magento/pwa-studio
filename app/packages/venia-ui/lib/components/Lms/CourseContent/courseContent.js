import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BrowserRouter, Link, useHistory } from 'react-router-dom';

import Button from '@magento/venia-ui/lib/components/Button';
import CourseModuleContent from '../CourseModuleContent/courseModuleContent';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useCourseContent } from '@magento/peregrine/lib/talons/Lms/useCourseContent';
import { useCourseItem } from '@magento/peregrine/lib/talons/Lms/useCourseItem';

import defaultClasses from './courseContent.module.css';

import noImageAvailable from '@magento/venia-ui/lib/assets/noImageAvailable.svg';
import { EmptyIcon } from '@magento/venia-ui/lib/assets/emptyIcon';
import ConfirmationModal from './ConfirmationModal/confirmationModal';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const DELIMITER = '/';

const CourseContent = props => {
    const { courseId, userCoursesIdList, setUserCoursesIdList, setMarkAsDoneListQty, courses } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const {
        courseContent,
        courseDetails,
        courseNotFound,
        enrolled,
        handleEnrollInCourse,
        handleUnenrollFromCourse,
        isConfirmationModalOpen,
        setConfirmationModalOpen
    } = useCourseContent({
        courseId,
        setUserCoursesIdList,
        userCoursesIdList,
        isEnrolled: userCoursesIdList.length !== 0 ? userCoursesIdList.includes(parseInt(courseId)) : false
    });

    const { coursePreviewUrl } = useCourseItem({
        courseImageUri: courseDetails?.overviewfiles[0].fileurl,
        courseModuleMimetype: courseDetails?.overviewfiles[0].mimetype
    });

    const history = useHistory();

    const learningTitle = 'Learning';

    const [sections, setSections] = useState([]);
    const [sectionSelected, setSectionSelected] = useState('');
    const [modules, setModules] = useState([]);
    const [moduleSelected, setModuleSelected] = useState();

    useEffect(() => {
        if (courseContent !== undefined && courseDetails !== undefined) {
            // TODO_B2B: Translations
            const sectionList = ['Descripción'];
            const moduleList = [courseDetails.summary];
            courseContent.forEach(course => {
                if (course.modules.length !== 0) {
                    sectionList.push(course.name);
                    moduleList.push(course);
                }
            });

            setSections(sectionList);
            setSectionSelected(sectionList[0]);
            setModules(moduleList);
            setModuleSelected(moduleList[0]);
        }
    }, [courseContent, courseDetails]);

    const breadcrumbs = (
        <nav className={classes.root} aria-live="polite" aria-busy="false">
            <BrowserRouter forceRefresh={true}>
                <Link className={classes.link} to="/">
                    <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
                </Link>
            </BrowserRouter>
            <span className={classes.divider}>{DELIMITER}</span>
            <Link className={classes.link} to="/learning">
                {learningTitle}
            </Link>
            {courseNotFound ? null : (
                <>
                    <span className={classes.divider}>{DELIMITER}</span>
                    <span className={classes.currentPage}>{courseDetails?.fullname}</span>
                </>
            )}
        </nav>
    );

    const handleGoToLearning = () => {
        history.push('/learning');
    };

    const noExistCourse = (
        <div className={classes.noExistCourseAdviceContainer}>
            <div className={classes.noCoursesImage}>
                <EmptyIcon />
            </div>
            <div>
                <p className={classes.noExistCourseAdviceText}>
                    <FormattedMessage
                        id={'lms.noExistCourseAdvice'}
                        defaultMessage={"Oops... Looks like the course you are trying to access doesn't exist"}
                    />
                </p>
                <p className={classes.noExistCourseAdviceText}>
                    <FormattedMessage
                        id={'lms.noExistAndStartCourseAdvice'}
                        defaultMessage={"You can start a course from the 'Learning' section"}
                    />
                </p>
            </div>
            <Button className={classes.goLearningButton} onClick={handleGoToLearning}>
                <FormattedMessage id={'lms.goLearning'} defaultMessage={'Go to Learning section'} />
            </Button>
        </div>
    );
    if (!courses) {
        return <LoadingIndicator />;
    }
    return (
        <div className={classes.container}>
            {breadcrumbs}
            {courseNotFound ? (
                <>{noExistCourse}</>
            ) : (
                <>
                    <div className={classes.courseContainer}>
                        {courseDetails !== undefined && (
                            <div className={classes.headerCourseContainer}>
                                {courseDetails.overviewfiles.length !== 0 ? (
                                    <img className={classes.courseImage} src={coursePreviewUrl} alt="Course logo" />
                                ) : (
                                    <img
                                        className={classes.courseImage}
                                        src={noImageAvailable}
                                        alt="Course logo not available"
                                    />
                                )}
                                <div className={classes.descriptionAndEnrollContainer}>
                                    <div>
                                        <p className={classes.courseTitle}>{courseDetails.fullname}</p>
                                        <p className={classes.summaryText}>{courseDetails.summary}</p>
                                    </div>
                                    <div className={classes.enrollButtonContainer}>
                                        <Button
                                            className={classes.enrollButton}
                                            onClick={() => setConfirmationModalOpen(true)}
                                            priority={'normal'}
                                        >
                                            {enrolled ? (
                                                <FormattedMessage
                                                    id={'lms.unsubscribe'}
                                                    defaultMessage={'Unsubscribe'}
                                                />
                                            ) : (
                                                <FormattedMessage id={'lms.subscribe'} defaultMessage={'Subscribe'} />
                                            )}
                                        </Button>
                                    </div>
                                    <ConfirmationModal
                                        isOpen={isConfirmationModalOpen}
                                        onCancel={() => setConfirmationModalOpen(false)}
                                        onConfirm={enrolled ? handleUnenrollFromCourse : handleEnrollInCourse}
                                        isEnrolled={enrolled}
                                        courseName={courseDetails.fullname}
                                    />
                                </div>
                            </div>
                        )}
                        {courseContent !== undefined && (
                            <div className={classes.bodyCourseContainer}>
                                <div className={classes.courseSectionTabs}>
                                    {sections.map(section => {
                                        return (
                                            <button
                                                key={section}
                                                className={
                                                    sectionSelected === section
                                                        ? classes.sectionTabActive
                                                        : classes.sectionTab
                                                }
                                                onClick={() => {
                                                    setModuleSelected(modules[sections.indexOf(section)]);
                                                    setSectionSelected(section);
                                                }}
                                            >
                                                {section === 'Descripción' ? (
                                                    <FormattedMessage
                                                        id={'compareProducts.Description'}
                                                        defaultMessage={'Description'}
                                                    />
                                                ) : (
                                                    section
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {sectionSelected !== 'Descripción' ? (
                                    moduleSelected !== undefined && (
                                        <div className={classes.courseSectionModuleActive}>
                                            <h1 className={classes.sectionTitle}>{sectionSelected}</h1>
                                            <ol key={moduleSelected.id} className={classes.courseSectionContainer}>
                                                {moduleSelected.modules.map((module, i) => {
                                                    return (
                                                        <CourseModuleContent
                                                            courseModule={module}
                                                            isEnrolled={enrolled}
                                                            setMarkAsDoneListQty={setMarkAsDoneListQty}
                                                            key={module.id}
                                                            white={i % 2 === 0}
                                                        />
                                                    );
                                                })}
                                            </ol>
                                        </div>
                                    )
                                ) : (
                                    <div className={classes.courseSectionModuleActive}>
                                        <h1 className={classes.sectionTitle}>
                                            <FormattedMessage
                                                id={'lms.CourseCharacteristicsAndObjectives'}
                                                defaultMessage={'Course characteristics and objectives'}
                                            />
                                        </h1>
                                        <div className={classes.courseSectionContainer}>
                                            <span className={classes.moduleSummary}>{moduleSelected}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CourseContent;
