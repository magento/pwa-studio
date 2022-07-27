import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './attachment.module.css';

import audioIcon from './Icons/audio.svg';
import csvIcon from './Icons/csv.svg';
import fileIcon from './Icons/file.svg';
import imageIcon from './Icons/image.svg';
import pdfIcon from './Icons/pdf.svg';
import textIcon from './Icons/text.svg';
import videoIcon from './Icons/video.svg';
import zipIcon from './Icons/zip.svg';

const Attachment = props => {
    const { filename, size, date, mimetype, isInline } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    // Texts

    // Icons

    // Methods
    const isoDateToChat = isoDate => {
        const months = [
            formatMessage({ id: 'csr.january', defaultMessage: 'Jan' }),
            formatMessage({ id: 'csr.february', defaultMessage: 'Feb' }),
            formatMessage({ id: 'csr.march', defaultMessage: 'Mar' }),
            formatMessage({ id: 'csr.april', defaultMessage: 'Apr' }),
            formatMessage({ id: 'csr.may', defaultMessage: 'May' }),
            formatMessage({ id: 'csr.juny', defaultMessage: 'Jun' }),
            formatMessage({ id: 'csr.july', defaultMessage: 'Jul' }),
            formatMessage({ id: 'csr.august', defaultMessage: 'Aug' }),
            formatMessage({ id: 'csr.september', defaultMessage: 'Sep' }),
            formatMessage({ id: 'csr.october', defaultMessage: 'Oct' }),
            formatMessage({ id: 'csr.november', defaultMessage: 'Nov' }),
            formatMessage({ id: 'csr.december', defaultMessage: 'Dec' })
        ];

        const date = new Date(isoDate);
        const day = date
            .getDate()
            .toString()
            .padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date
            .getHours()
            .toString()
            .padStart(2, '0');
        const minutes = date
            .getMinutes()
            .toString()
            .padStart(2, '0');

        return `${day} ${month} ${year} - ${hours}:${minutes}`;
    };

    const getIconByMimeType = mimetype => {
        switch (mimetype) {
            case 'audio/aac':
            case 'audio/mp3':
            case 'audio/ogg':
            case 'audio/wav':
                return audioIcon;
            case 'text/csv':
                return csvIcon;
            case 'application/gzip':
            case 'application/rar':
            case 'application/tar.gz':
            case 'application/zip':
                return zipIcon;
            case 'application/pdf':
                return pdfIcon;
            case 'image/gif':
            case 'image/jpeg':
            case 'image/png':
                return imageIcon;
            case 'text/plain':
                return textIcon;
            case 'video/avi':
            case 'video/mp4':
            case 'video/mpeg':
                return videoIcon;
            default:
                return fileIcon;
        }
    };

    return (
        <div className={isInline ? classes.containerInline : classes.containerBody}>
            <img src={getIconByMimeType(mimetype)} alt={filename} />
            <div className={classes.info}>
                <div className={isInline ? classes.filenameAndSizeInline : classes.filenameAndSizeBody}>
                    <p className={classes.filenameText}>{filename}</p>
                    <p className={classes.sizeText}>{`(${Math.ceil(size / 1000)} KB)`}</p>
                </div>
                {!isInline && <p className={classes.dateText}>{isoDateToChat(date)}</p>}
            </div>
        </div>
    );
};

export default Attachment;
