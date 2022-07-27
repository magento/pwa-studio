/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';

import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useChat } from '../../talons/useChat';

import defaultClasses from './chat.module.css';

import doubleCheckUnread from './Icons/doubleCheckUnread.svg';
import doubleCkeckRead from './Icons/doubleCheckRead.svg';
import optionsIcon from './Icons/optionsIcon.svg';
import sendCommentIcon from './Icons/sendCommentIcon.svg';
import { Paperclip as AttachmentIcon, Smile as EmojiPickerIcon } from 'react-feather';
import Attachment from './Attachment/attachment';

const Chat = props => {
    const { ticketId } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { ticketComments, lastCustomerTicketsId, lastMessageRef, attachments, sendCommentAndAttachments } = useChat({
        ticketId
    });
    const { formatMessage } = useIntl();

    // Texts
    const chatWithText = formatMessage({ id: 'csr.chatWith', defaultMessage: 'Chat with' });
    const agentText = formatMessage({ id: 'csr.agent', defaultMessage: 'Agent B2BStore' });
    const noCommentsText = formatMessage({ id: 'csr.noComments', defaultMessage: 'No comments yet' });
    const fetchingCommentsText = formatMessage({ id: 'csr.fetchingComments', defaultMessage: 'Fetching comments' });
    const sharedFilesText = formatMessage({ id: 'csr.sharedFiles', defaultMessage: 'Shared files' });
    const typeYourMessageText = formatMessage({ id: 'csr.typeYourMessage', defaultMessage: 'Type your message' });

    // Icons
    const emojiPickerIcon = <Icon src={EmojiPickerIcon} size={25} />;
    const attachmentIcon = <Icon classes={{ icon: classes.attachmentIcon }} src={AttachmentIcon} size={25} />;

    const emojiPicker = <Trigger action={() => console.log('In progress...')}>{emojiPickerIcon}</Trigger>;
    const attachmentButton = <Trigger action={() => console.log('In progress...')}>{attachmentIcon}</Trigger>;
    const [comment, setComment] = useState('');

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

    const getCommentTextStyled = (text, type, isCustomer) => {
        const commentClass = isCustomer ? classes.chatBodyCommentCustomerText : classes.chatBodyCommentAgentText;
        switch (type) {
            case 'text/html':
                return <p className={commentClass} dangerouslySetInnerHTML={{ __html: text }} />;
            case 'text/plain':
                return <p className={commentClass}>{text}</p>;
            default:
                return <p className={commentClass}>{text}</p>;
        }
    };

    const showAttachmentsInline = attachmentFiles => {
        return (
            <div className={classes.attachmentsInlineContainer}>
                {attachmentFiles.map(attachment => {
                    return (
                        <Attachment
                            filename={attachment.filename}
                            size={attachment.size}
                            date={attachment.created_at}
                            mimetype={attachment.preferences['Content-Type'] || attachment.preferences['Mime-Type']}
                            isInline={true}
                        />
                    );
                })}
            </div>
        );
    };

    const attachmentsBody = attachmentFiles => {
        return (
            <div className={classes.attachmentsBodyContainer}>
                {attachmentFiles.map(attachment => {
                    return (
                        <Attachment
                            filename={attachment.filename}
                            size={attachment.size}
                            date={attachment.created_at}
                            mimetype={attachment.preferences['Content-Type'] || attachment.preferences['Mime-Type']}
                            isInline={false}
                        />
                    );
                })}
            </div>
        );
    };

    const showCommentMetadata = (isCustomer, creationDate, commentId) => {
        return (
            <div className={classes.commentMetadataContainer}>
                <p
                    className={
                        isCustomer ? classes.chatBodyCommentTimeCustomerText : classes.chatBodyCommentTimeAgentText
                    }
                >
                    {isoDateToChat(creationDate)}
                </p>
                {isCustomer && (
                    <img
                        src={lastCustomerTicketsId.includes(commentId) ? doubleCheckUnread : doubleCkeckRead}
                        className={classes.doubleCheckIcon}
                        alt="Double check icon"
                    />
                )}
            </div>
        );
    };

    const handleSubmit = () => {
        sendCommentAndAttachments(comment);
        document.getElementById('chatTextForm').reset();
        setComment('');
        document.getElementById('chatTextInput').focus();
    };

    // Components
    const chatHeader = (
        <div className={classes.chatHeaderContainer}>
            <div className={classes.chatHeaderTexts}>
                <p className={classes.chatHeaderTitle}>{chatWithText}</p>
                <p className={classes.chatHeaderAgent}>{agentText}</p>
            </div>
            <div className={classes.chatHeaderOptions}>
                <img src={optionsIcon} alt="options" className={classes.chatHeaderOptionsIcon} />
            </div>
        </div>
    );

    const chatBody =
        ticketComments !== undefined &&
        lastCustomerTicketsId !== undefined &&
        (ticketComments?.length === 0 ? (
            <p>{noCommentsText}</p>
        ) : (
            ticketComments.map(comment => {
                const isCustomer = comment.sender === 'Customer';
                return (
                    <div
                        key={comment.id}
                        className={isCustomer ? classes.chatBodyCustomerContainer : classes.chatBodyAgentContainer}
                    >
                        <div className={isCustomer ? classes.chatBodyCustomerComment : classes.chatBodyAgentComment}>
                            {getCommentTextStyled(comment.body, comment.content_type, isCustomer)}
                        </div>
                        {comment.attachments.length > 0 && showAttachmentsInline(comment.attachments)}
                        {showCommentMetadata(isCustomer, comment.created_at, comment.id)}
                    </div>
                );
            })
        ));

    return (
        <div className={classes.container}>
            {ticketComments === undefined ? (
                <LoadingIndicator children={fetchingCommentsText} classes={{ root: classes.loadingIndicator }} />
            ) : (
                <div className={classes.chatAndFilesContainer}>
                    <div className={classes.chatAndInputContainer}>
                        {chatHeader}
                        <div className={classes.chatContainer}>
                            {chatBody}
                            <span ref={lastMessageRef} />
                        </div>
                        <Form id="chatTextForm" className={classes.chatInputContainer} onSubmit={handleSubmit}>
                            <TextInput
                                id="chatTextInput"
                                field="comment"
                                placeholder={typeYourMessageText}
                                maxLength={10000}
                                before={emojiPicker}
                                after={attachmentButton}
                                value={comment}
                                onChange={e => setComment(e.target.value.replace(/\s+/g, ' ').trim())}
                                classes={{ input: classes.chatInput }}
                            />
                            <Button
                                className={classes.sendCommentButton}
                                disabled={comment === ''}
                                priority={'high'}
                                type="submit"
                            >
                                <img src={sendCommentIcon} alt="send" className={classes.sendCommentIcon} />
                            </Button>
                        </Form>
                    </div>
                    <div className={classes.chatFilesContainer}>
                        <p className={classes.chatFilesTitle}>{sharedFilesText}</p>
                        {attachmentsBody(attachments)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
