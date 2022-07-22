/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useChat } from '../../talons/useChat';

import defaultClasses from './chat.module.css';

import optionsIcon from './Icons/optionsIcon.svg';
import doubleCkeckRead from './Icons/doubleCheckRead.svg';
import doubleCheckUnread from './Icons/doubleCheckUnread.svg';

const Chat = props => {
    const { ticketId } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { ticketComments } = useChat({ ticketId });
    const { formatMessage } = useIntl();

    // Texts
    const chatWithText = formatMessage({ id: 'csr.chatWith', defaultMessage: 'Chat with' });
    const agentText = formatMessage({ id: 'csr.agent', defaultMessage: 'Agent B2BStore' });
    const noCommentsText = formatMessage({ id: 'csr.noComments', defaultMessage: 'No comments yet' });
    const fetchingCommentsText = formatMessage({ id: 'csr.fetchingComments', defaultMessage: 'Fetching comments' });
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

    const chatBody =
        ticketComments !== undefined &&
        (ticketComments?.length === 0 ? (
            <p>{noCommentsText}</p>
        ) : (
            ticketComments.map(comment => {
                const isCustomer = comment.sender === 'Customer';
                return (
                    <div className={isCustomer ? classes.chatBodyCustomerContainer : classes.chatBodyAgentContainer}>
                        <div
                            key={comment.id}
                            className={isCustomer ? classes.chatBodyCustomerComment : classes.chatBodyAgentComment}
                        >
                            {getCommentTextStyled(comment.body, comment.content_type, isCustomer)}
                        </div>
                        <div className={classes.commentMetadataContainer}>
                            <p
                                className={
                                    isCustomer
                                        ? classes.chatBodyCommentTimeCustomerText
                                        : classes.chatBodyCommentTimeAgentText
                                }
                            >
                                {isoDateToChat(comment.created_at)}
                            </p>
                            {isCustomer && (
                                <img
                                    src={doubleCkeckRead}
                                    className={classes.doubleCheckIcon}
                                    alt="Double check icon"
                                />
                            )}
                        </div>
                    </div>
                );
            })
        ));

    console.log(ticketComments);

    return (
        <div className={classes.container}>
            {ticketComments === undefined ? (
                <LoadingIndicator children={fetchingCommentsText} classes={{ root: classes.loadingIndicator }} />
            ) : (
                <>
                    {chatHeader}
                    <div className={classes.chatContainer}>{chatBody}</div>
                </>
            )}
        </div>
    );
};

export default Chat;
