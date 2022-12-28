/* eslint-disable react/jsx-no-literals */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';

import Attachment from './Attachment/attachment';
import AttachmentModal from './AttachmentModal/attachmentModal';
import Button from '../../Button';
import Dropzone from './Dropzone/dropzone';
import Icon from '../../Icon';
import LoadingIndicator from '../../LoadingIndicator';
import TextInput from '../../TextInput';
import Trigger from '../../Trigger';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useChat } from '@magento/peregrine/lib/talons/Csr/useChat';

import defaultClasses from './chat.module.css';

import emptyAttachmentsIcon from '../../Lms/CoursesCatalog/Icons/noCourses.svg';
import doubleCheckUnread from './Icons/doubleCheckUnread.svg';
import doubleCkeckRead from './Icons/doubleCheckRead.svg';
import optionsIcon from './Icons/optionsIcon.svg';
import sendCommentIcon from './Icons/sendCommentIcon.svg';
import closeIcon from './Icons/close.svg';
import { Smile as EmojiPickerIcon } from 'react-feather';

import EmojiPicker, { Categories } from 'emoji-picker-react';

const Chat = props => {
    const { ticketId, isTicketClosed } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const {
        attachmentModal,
        attachments,
        comment,
        dropzoneError,
        filesUploaded,
        isEmojiPickerOpen,
        lastCustomerTicketsId,
        lastMessageRef,
        onEmojiClick,
        sendCommentAndAttachments,
        setAttachmentModal,
        setComment,
        setDropzoneError,
        setFilesUploaded,
        setIsEmojiPickerOpen,
        ticketComments
    } = useChat({
        isTicketClosed,
        ticketId
    });
    const { formatMessage } = useIntl();

    // Texts
    const activitiesText = formatMessage({ id: 'csr.activities', defaultMessage: 'Activities' });
    const agentText = formatMessage({ id: 'csr.agent', defaultMessage: 'Agent B2BStore' });
    const animalsNatureText = formatMessage({ id: 'csr.animals_nature', defaultMessage: 'Animals & Nature' });
    const chatWithText = formatMessage({ id: 'csr.chatWith', defaultMessage: 'Chat with' });
    const fetchingCommentsText = formatMessage({ id: 'csr.fetchingComments', defaultMessage: 'Fetching comments' });
    const flagsText = formatMessage({ id: 'csr.flags', defaultMessage: 'Flags' });
    const foodDrinkText = formatMessage({ id: 'csr.food_drink', defaultMessage: 'Food & Drink' });
    const noCommentsText = formatMessage({ id: 'csr.noComments', defaultMessage: 'No comments yet' });
    const objectsText = formatMessage({ id: 'csr.objects', defaultMessage: 'Objects' });
    // const recentlyUsedText = formatMessage({ id: 'csr.recently_used', defaultMessage: 'Recently Used' });
    const searchEmojiText = formatMessage({ id: 'searchTrigger.search', defaultMessage: 'Search' });
    const sharedFilesText = formatMessage({ id: 'csr.sharedFiles', defaultMessage: 'Shared files' });
    const smileysPeopleText = formatMessage({ id: 'csr.smileys_people', defaultMessage: 'Smileys & People' });
    const symbolsText = formatMessage({ id: 'csr.symbols', defaultMessage: 'Symbols' });
    const travelPlacesText = formatMessage({ id: 'csr.travel_places', defaultMessage: 'Travel & Places' });
    const typeYourMessageText = formatMessage({ id: 'csr.typeYourMessage', defaultMessage: 'Type your message' });
    const emptyAttachmentsText = formatMessage({ id: 'csr.emptyAttachments', defaultMessage: 'No attachments yet' });
    const reopenToSendAMessageText = formatMessage({
        id: 'csr.reopenToSendAMessage',
        defaultMessage: 'Reopen the ticket to send a new message'
    });

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

    const showAttachmentsInline = (attachmentFiles, isChat = false) => {
        return attachmentFiles.map(file => (
            <div
                className={isChat ? classes.dropzoneItemChat : classes.dropzoneItem}
                key={isChat ? file.filename : file.name}
            >
                <span className={classes.dropzoneItemName} title={isChat ? file.filename : file.name}>
                    {isChat ? file.filename : file.name}
                </span>
                <div className={classes.dropzoneItemDataContainer}>
                    <p className={classes.dropzoneItemSize}>{Math.ceil(file.size / 1000)} KB</p>
                    {!isChat && (
                        <img
                            className={classes.dropzoneItemCloseButton}
                            src={closeIcon}
                            alt="Close icon"
                            onClick={() => deleteUploadedFile(file)}
                        />
                    )}
                </div>
            </div>
        ));
    };

    const showAttachmentsBody = attachmentFiles => {
        return (
            <div className={classes.attachmentsBodyContainer}>
                {attachmentFiles.map(attachment => {
                    return (
                        <Attachment
                            key={attachment.id}
                            filename={attachment.filename}
                            size={attachment.size}
                            date={attachment.created_at}
                            mimetype={attachment.preferences['Content-Type'] || attachment.preferences['Mime-Type']}
                            ticketId={ticketId}
                            articleId={attachment.article_id}
                            fileId={attachment.id}
                        />
                    );
                })}
            </div>
        );
    };

    const showEmptyAttachmentsMessage = () => {
        return (
            <div className={classes.emptyAttachmentsContainer}>
                <img className={classes.emptyAttachmentsIcon} src={emptyAttachmentsIcon} alt="Empty attachments icon" />
                <p className={classes.emptyAttachmentsText}>{emptyAttachmentsText}</p>
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

    const deleteUploadedFile = file => {
        setFilesUploaded(prevAcceptedFiles => prevAcceptedFiles.filter(f => f.name !== file.name));
    };

    // Components
    const chatHeader = (
        <div className={classes.chatHeaderContainer}>
            <div className={classes.chatHeaderTexts}>
                <p className={classes.chatHeaderTitle}>{chatWithText}</p>
                <p className={classes.chatHeaderAgent}>{agentText}</p>
            </div>
            <button onClick={() => setAttachmentModal(true)} className={classes.chatHeaderOptions}>
                <img src={optionsIcon} alt="options" className={classes.chatHeaderOptionsIcon} />
            </button>
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
                        {comment.attachments.length > 0 && (
                            <div
                                className={
                                    isCustomer
                                        ? classes.attachmentsInlineCustomerContainer
                                        : classes.attachmentsInlineContainer
                                }
                            >
                                {showAttachmentsInline(comment.attachments, true)}
                            </div>
                        )}
                        {showCommentMetadata(isCustomer, comment.created_at, comment.id)}
                    </div>
                );
            })
        ));

    const emojiPickerButton = (
        <Trigger action={() => !isTicketClosed && setIsEmojiPickerOpen(prevState => !prevState)}>
            {isEmojiPickerOpen ? (
                <img className={classes.emojiPickerIcon} src={closeIcon} alt="Close icon" />
            ) : (
                <Icon
                    src={EmojiPickerIcon}
                    size={25}
                    classes={{
                        root: isTicketClosed ? classes.emojiPickerIconDisabled : classes.emojiPickerIconEnabled
                    }}
                />
            )}
        </Trigger>
    );

    const attachmentButton = (
        <Trigger action={() => {}}>
            <Dropzone
                filesUploaded={filesUploaded}
                setFilesUploaded={setFilesUploaded}
                setDropzoneError={setDropzoneError}
                isTicketClosed={isTicketClosed}
            />
        </Trigger>
    );

    const emojiPickerCategories = [
        // {
        //     name: recentlyUsedText,
        //     category: Categories.SUGGESTED
        // },
        {
            name: smileysPeopleText,
            category: Categories.SMILEYS_PEOPLE
        },
        {
            name: animalsNatureText,
            category: Categories.ANIMALS_NATURE
        },
        {
            name: foodDrinkText,
            category: Categories.FOOD_DRINK
        },
        {
            name: travelPlacesText,
            category: Categories.TRAVEL_PLACES
        },
        {
            name: activitiesText,
            category: Categories.ACTIVITIES
        },
        {
            name: objectsText,
            category: Categories.OBJECTS
        },
        {
            name: symbolsText,
            category: Categories.SYMBOLS
        },
        {
            name: flagsText,
            category: Categories.FLAGS
        }
    ];

    return (
        <div className={classes.container}>
            {ticketComments === undefined ? (
                <LoadingIndicator children={fetchingCommentsText} classes={{ root: classes.loadingIndicator }} />
            ) : (
                <div className={classes.chatAndFilesContainer}>
                    <div className={classes.chatAndInputContainer}>
                        {chatHeader}
                        <div id="chatContainer" className={classes.chatContainer}>
                            {chatBody}
                            <span ref={lastMessageRef} />
                        </div>
                        <div className={classes.chatEmojiContainer}>
                            <Form id="chatTextForm" className={classes.chatInputContainer} onSubmit={handleSubmit}>
                                <TextInput
                                    id="chatTextInput"
                                    field="comment"
                                    placeholder={isTicketClosed ? reopenToSendAMessageText : typeYourMessageText}
                                    maxLength={10000}
                                    before={emojiPickerButton}
                                    after={attachmentButton}
                                    disabled={isTicketClosed}
                                    supportEmoji={true}
                                    value={comment}
                                    onChange={e => {
                                        setComment(e.target.value);
                                    }}
                                    classes={{ input: isTicketClosed ? classes.chatInputDisabled : classes.chatInput }}
                                    autoComplete="off"
                                />
                                <Button
                                    className={classes.sendCommentButton}
                                    disabled={comment.replace(/\s+/g, ' ').trim() === ''}
                                    priority={'high'}
                                    type="submit"
                                >
                                    <img src={sendCommentIcon} alt="send" className={classes.sendCommentIcon} />
                                </Button>
                            </Form>
                            <div
                                id="emojiPicker"
                                className={isEmojiPickerOpen ? classes.emojiPicker : classes.emojiPickerDisabled}
                            >
                                <EmojiPicker
                                    id="emojiPicker"
                                    height={300}
                                    width={'clamp(250px, 25vw, 280px)'}
                                    onEmojiClick={onEmojiClick}
                                    searchDisabled
                                    previewConfig={{ showPreview: false }}
                                    searchPlaceholder={searchEmojiText}
                                    categories={emojiPickerCategories}
                                />
                            </div>
                        </div>
                        {filesUploaded.length > 0 && (
                            <div className={classes.filesUploadedContainer}>{showAttachmentsInline(filesUploaded)}</div>
                        )}
                        {dropzoneError !== '' && <p className={classes.errorMessage}>{dropzoneError}</p>}
                        {filesUploaded.length >= 6 && (
                            <p className={classes.errorMessage}>
                                {formatMessage({
                                    id: 'csr.maxFilesReached',
                                    defaultMessage: 'Maximum number of files reached'
                                })}
                            </p>
                        )}
                    </div>
                    <div className={classes.chatFilesContainer}>
                        <p className={classes.chatFilesTitle}>{sharedFilesText}</p>
                        {attachments !== undefined && attachments.length > 0
                            ? showAttachmentsBody(attachments)
                            : showEmptyAttachmentsMessage()}
                    </div>
                    <AttachmentModal
                        isOpen={attachmentModal}
                        onConfirm={() => {
                            setAttachmentModal(false);
                        }}
                        showAttachmentsBody={
                            attachments !== undefined && attachments.length > 0
                                ? showAttachmentsBody(attachments)
                                : showEmptyAttachmentsMessage()
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default Chat;
