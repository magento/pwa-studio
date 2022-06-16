import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CourseItem from '@orienteed/lms/src/components/CourseItem';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import getCourses from '@orienteed/lms/services/getCourses';
import getCoursesByCategory from '@orienteed/lms/services/getCoursesByCategory';

import defaultClasses from './courseSlider.css';

import ArrowRightIcon from './Icons/arrowRight.svg';

const CourseSlider = ({ bannerType, categoryId }) => {
    const classes = mergeClasses(defaultClasses);
    const [courseData, setCourseData] = useState();
    const { formatMessage } = useIntl();

    const learnOurProductsText = formatMessage({
        id: 'courseSlider.learnOurProducts',
        defaultMessage: 'Learn our products'
    });

    const showAllCoursesText = formatMessage({
        id: 'courseSlider.showAllCourses',
        defaultMessage: 'Show all courses'
    });

    const moodleMagentoMatchCategoryId = {
        5: 10,
        12: 11,
        3: 12,
        7: 13,
        18: 15
    };

    // TODO_B2B: Customize no courses message
    const emptyCoursesMessage = 'There are no courses available';

    useEffect(() => {
        switch (bannerType) {
            case 'category':
                if (moodleMagentoMatchCategoryId[categoryId] !== undefined) {
                    getCoursesByCategory(
                        moodleMagentoMatchCategoryId[categoryId]
                    ).then(courseResponse => {
                        courseResponse = courseResponse.sort(() => {
                            return Math.random() - 0.5;
                        });
                        setCourseData(courseResponse.slice(0, 4));
                    });
                    break;
                } else {
                    getCourses().then(courseResponse => {
                        courseResponse = courseResponse.sort(() => {
                            return Math.random() - 0.5;
                        });
                        setCourseData(courseResponse.slice(0, 4));
                    });
                    break;
                }
            case 'latest':
                getCourses().then(courseResponse => {
                    setCourseData(
                        courseResponse.slice(courseResponse.length - 4)
                    );
                });
                break;
            default:
                getCourses().then(courseResponse => {
                    courseResponse = courseResponse.sort(() => {
                        return Math.random() - 0.5;
                    });
                    setCourseData(courseResponse.slice(0, 4));
                });
                break;
        }
    }, [bannerType, categoryId]);

    return (
        <section className={classes.courseSliderContainer}>
            <header className={classes.courseSliderHeaderContainer}>
                <h1 className={classes.headerTitle}>{learnOurProductsText}</h1>
                <Link
                    className={classes.courseSliderHeaderLinkContainer}
                    to="/learning"
                >
                    <span className={classes.linkText}>
                        {showAllCoursesText}
                    </span>
                    <img
                        className={classes.linkIcon}
                        src={ArrowRightIcon}
                        alt="Arrow right icon"
                    />
                </Link>
            </header>
            <aside>
                {courseData === undefined ? (
                    <LoadingIndicator />
                ) : courseData.length !== 0 ? (
                    <div className={classes.courseSliderBodyContainer}>
                        {courseData.map(course => {
                            return (
                                <CourseItem
                                    key={course.id}
                                    data={course}
                                    isProgressCourse={false}
                                    isProgressTab={false}
                                />
                            );
                        })}
                    </div>
                ) : (
                    emptyCoursesMessage
                )}
            </aside>
        </section>
    );
};

export default CourseSlider;
