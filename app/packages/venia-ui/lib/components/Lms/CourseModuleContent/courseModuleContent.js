import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import ContentDialog from '../ContentDialog';
import ConfirmationModal from './ConfirmationModal';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useCourseModuleContent } from '@magento/peregrine/lib/talons/Lms/useCourseModuleContent';

import defaultClasses from './courseModuleContent.module.css';

import markAsDone from '@magento/peregrine/lib/RestApi/Lms/completion/markAsDone';

import audioIcon from './Icons/audio.svg';
import checkFillIcon from './Icons/checkFill.svg';
import checkNoFillIcon from './Icons/checkNoFill.svg';
import downloadIcon from './Icons/download.svg';
import fileIcon from './Icons/file.svg';
import imageIcon from './Icons/image.svg';
import notFoundIcon from './Icons/notFound.svg';
import pdfIcon from './Icons/pdf.svg';
import urlIcon from './Icons/url.svg';
import videoIcon from './Icons/video.svg';
import viewIcon from './Icons/view.svg';

const CourseModuleContent = props => {
    const { courseModule, isEnrolled, setMarkAsDoneListQty, white } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const {
        courseModuleUrl,
        isConfirmationModalOpen,
        isDone,
        isModalOpen,
        setConfirmationModalOpen,
        setIsDone,
        setIsModalOpen
    } = useCourseModuleContent({
        courseModuleUri: courseModule.hasOwnProperty('contents') && courseModule.contents[0].fileurl,
        courseModuleMimetype: courseModule.hasOwnProperty('contents') && courseModule.contents[0].mimetype,
        completiondata: courseModule.completiondata,
        isEnrolled
    });

    const { formatMessage } = useIntl();

    const markAsDoneText = formatMessage({ id: 'lms.markAsDone', defaultMessage: 'Mark as done' });
    const doneText = formatMessage({ id: 'lms.done', defaultMessage: 'Done' });
    const viewText = formatMessage({ id: 'lms.view', defaultMessage: 'View' });
    const downloadText = formatMessage({ id: 'lms.download', defaultMessage: 'Download' });
    const visitText = formatMessage({ id: 'lms.visit', defaultMessage: 'Visit' });

    const handleOpenPopUp = () => {
        setIsModalOpen(true);
    };

    const handleClosePopUp = () => {
        setIsModalOpen(false);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = courseModuleUrl;
        link.download = courseModule.contents[0].filename;
        link.click();
    };

    const handleMarkAsDone = () => {
        setConfirmationModalOpen(false);
        markAsDone(courseModule.id).then(reply =>
            reply ? setIsDone(true) && setMarkAsDoneListQty(list => [...list, true]) : null
        );
    };

    const handleOpenConfirmationModal = () => {
        setConfirmationModalOpen(true);
    };

    const selectIcon = contentFile => {
        switch (contentFile.type) {
            case 'file': {
                switch (contentFile.mimetype.split('/')[0]) {
                    case 'audio':
                        return audioIcon;
                    case 'video':
                        return videoIcon;
                    case 'application':
                        return pdfIcon;
                    case 'image':
                        return imageIcon;
                    default:
                        return fileIcon;
                }
            }
            case 'url': {
                return urlIcon;
            }
            default: {
                return fileIcon;
            }
        }
    };

    const markAsDoneButton = () => {
        return isDone ? (
            <img title={doneText} src={checkFillIcon} className={classes.actionIconsDisabled} alt="Done" />
        ) : (
            <button className={classes.actionIcons} onClick={() => handleOpenConfirmationModal()}>
                <img title={markAsDoneText} src={checkNoFillIcon} alt="Mark as done" />
            </button>
        );
    };

    const actionContentButtons = contentFile => {
        if (isEnrolled) {
            switch (contentFile.type) {
                case 'file':
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <button title={viewText} className={classes.actionIcons} onClick={() => handleOpenPopUp()}>
                                <img src={viewIcon} alt="View" />
                            </button>
                            <button
                                title={downloadText}
                                className={classes.actionIcons}
                                onClick={() => handleDownload()}
                            >
                                <img src={downloadIcon} alt="Download" />
                            </button>
                            {markAsDoneButton()}
                        </div>
                    );
                case 'url': {
                    return (
                        <div className={classes.courseContentContainerLeft}>
                            <a
                                title={visitText}
                                className={classes.actionIcons}
                                href={contentFile.fileurl}
                                target="_blank"
                            >
                                <img src={viewIcon} alt="Visit" />
                            </a>
                            {markAsDoneButton()}
                        </div>
                    );
                }
            }
        }
    };

    return (
        <li
            className={white ? classes.courseContentContainer : classes.courseContentContainerOdd}
            key={courseModule.id}
        >
            {courseModule.hasOwnProperty('contents') ? (
                <>
                    <div className={classes.courseContentContainerLeft}>
                        <div className={classes.courseContentIconContainer}>
                            <img
                                src={selectIcon(courseModule.contents[0])}
                                className={classes.courseContentIcon}
                                alt="file type icon"
                            />
                        </div>
                        <p className={classes.moduleTitle}>{courseModule.name}</p>
                    </div>
                    <div className={classes.courseContentContainerRight}>
                        {actionContentButtons(courseModule.contents[0])}
                    </div>
                    <ContentDialog
                        dialogName={courseModule.name}
                        url={courseModuleUrl}
                        contentFile={courseModule.contents[0]}
                        isModalOpen={isModalOpen}
                        handleClosePopUp={handleClosePopUp}
                        handleDownload={handleDownload}
                    />
                </>
            ) : (
                <div className={classes.courseContentContainerLeft}>
                    <img src={notFoundIcon} width="30" alt="not found icon" />
                    <span>
                        <FormattedMessage id={'lms.notFound'} defaultMessage={'Content not available'} />
                    </span>
                </div>
            )}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onCancel={() => setConfirmationModalOpen(false)}
                onConfirm={handleMarkAsDone}
                courseModuleName={courseModule.name}
            />
        </li>
    );
};

export default CourseModuleContent;
