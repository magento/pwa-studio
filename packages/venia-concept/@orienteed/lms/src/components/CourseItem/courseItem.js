import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import defaultClasses from './courseItem.module.css';

import noImageAvailable from './Icons/noImageAvailable.svg';
import lockIcon from './Icons/lock.svg';

const CourseItem = props => {
    const { data, isProgressCourse, isProgressTab } = props;
    const [{ isSignedIn }] = useUserContext();
    const classes = useStyle(defaultClasses, props.classes);
    const history = useHistory();
    const { formatMessage } = useIntl();

    const startCourseText = formatMessage({
        id: 'lms.watchCourse',
        defaultMessage: 'Watch Course'
    });

    const resumeCourseText = formatMessage({
        id: 'lms.resumeCourse',
        defaultMessage: 'Resume Course'
    });

    const signInFirstText = formatMessage({
        id: 'lms.signInFirst',
        defaultMessage: 'Sign In first'
    });

    const generalTag = formatMessage({
        id: 'lms.general',
        defaultMessage: 'General'
    });

    const inProgressTag = formatMessage({
        id: 'lms.inProgress',
        defaultMessage: 'In progress'
    });

    const handleGoToCourse = useCallback(() => {
        history.push(`/course/${data.id}`);
    }, [history, data.id]);

    const handleGoToSignIn = useCallback(() => {
        history.push('/sign-in');
    }, [history]);

    const categoryTag =
        data.categoryname !== '' ? (
            <span className={classes.categoryTag}>
                {isProgressCourse ? `${data.categoryname} | ${inProgressTag}` : data.categoryname}
            </span>
        ) : (
            <span className={classes.categoryTag}>
                {isProgressCourse ? `${generalTag} | ${inProgressTag}` : generalTag}
            </span>
        );

    const courseLogo =
        data.overviewfiles.length !== 0 ? (
            <img
                className={classes.courseImage}
                src={`${data.overviewfiles[0].fileurl}?token=af547e6e35fca251a48ff4bedb7f1298`}
                alt="Course logo"
            />
        ) : (
            <img className={classes.courseImage} src={noImageAvailable} alt="Course logo not available" />
        );

    const progressBar = () => {
        const progressNumber = data.progress !== null ? data.progress.toFixed(2) : (0).toFixed(2);
        const progressText = `${progressNumber} %`;

        return (
            <div className={classes.progressBarContainer}>
                <div className={classes.progressBar}>
                    <div className={classes.progressBarFill} style={{ width: `${progressNumber}%` }}>
                        <div className={classes.progressBarFillContainer}>
                            <span className={classes.progressBarFillText}>{progressText}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <article key={data.id} className={classes.courseContainer}>
            {courseLogo}
            <div className={classes.courseBody}>
                <h1 className={classes.courseTitle}>{data.fullname}</h1>
                {isProgressTab ? null : categoryTag}
                {isProgressTab ? progressBar() : null}
                <p className={classes.courseDescription}>{data.summary}</p>
                <div className={classes.actionButtonContainer}>
                    <Button className={classes.actionButton} onClick={isSignedIn ? handleGoToCourse : handleGoToSignIn}>
                        {isSignedIn ? (
                            isProgressCourse || isProgressTab ? (
                                resumeCourseText
                            ) : (
                                startCourseText
                            )
                        ) : (
                            <>
                                <img src={lockIcon} className={classes.iconStyle} alt="Lock icon" />
                                {signInFirstText}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default CourseItem;
