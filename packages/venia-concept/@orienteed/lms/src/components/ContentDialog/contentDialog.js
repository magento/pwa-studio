import React from 'react';
import { useIntl } from 'react-intl';

import Dialog from '@magento/venia-ui/lib/components/Dialog';

import { useStyle } from '@magento/venia-ui/lib/classify';

import OpenIcon from './Icons/open.svg';

import defaultClasses from './contentDialog.module.css';

const ContentDialog = props => {
    const { dialogName, url, contentFile, isModalOpen, handleClosePopUp, handleDownload } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const openMessage = formatMessage({ id: 'lms.open', defaultMessage: 'Open' });
    const warningMessage = formatMessage({
        id: 'lms.browserIncompatibility',
        defaultMessage: 'This content is not available for this browser.'
    });
    const iframeObject = (
        <div className={classes.frameContainer}>
            <a className={classes.openTabButton} href={url} target="_blank">
                <img src={OpenIcon} className={classes.openTabIcon} alt="Open icon" />
                {openMessage}
            </a>
            <iframe
                title="Course content"
                frameBorder="0"
                allowFullScreen="1"
                loading="lazy"
                className={classes.fileFrame}
                src={url}
            />
        </div>
    );

    const embededObject = () => {
        switch (contentFile.type) {
            case 'file': {
                switch (contentFile.mimetype.split('/')[0]) {
                    case 'audio':
                        return (
                            <audio controls className={classes.audioFrame}>
                                <track kind="captions" />
                                <source src={url} />
                                {warningMessage}
                            </audio>
                        );
                    case 'video':
                        return (
                            <video controls className={classes.videoFrame}>
                                <track kind="captions" />
                                <source src={url} />
                                {warningMessage}
                            </video>
                        );
                    case 'application':
                        return iframeObject;
                    case 'image':
                        return <img src={url} className={classes.imageDialog} alt="Course content" />;
                    default:
                        return iframeObject;
                }
            }
            default: {
                return iframeObject;
            }
        }
    };

    return (
        <Dialog
            title={dialogName}
            confirmTranslationId={'lms.download'}
            confirmText="Download"
            cancelTranslationId={'global.close'}
            cancelText="Close"
            isOpen={isModalOpen}
            onCancel={handleClosePopUp}
            onConfirm={handleDownload}
        >
            {embededObject()}
        </Dialog>
    );
};

export default ContentDialog;
