import { useRef, useState, useEffect, useMemo } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getTicketComments from '../../RestApi/Csr/tickets/ticket_articles/getTicketComments';
import sendComment from '../../RestApi/Csr/tickets/ticket_articles/sendComment';

export const useChat = props => {
    const { isTicketClosed, ticketId } = props;
    const [{ isSignedIn }] = useUserContext();

    // Refs
    const lastMessageRef = useRef(null);

    // States
    const [attachmentModal, setAttachmentModal] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [comment, setComment] = useState('');
    const [dropzoneError, setDropzoneError] = useState('');
    const [filesUploaded, setFilesUploaded] = useState([]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [lastCustomerTicketsId, setLastCustomerTicketId] = useState();
    const [ticketComments, setTicketComments] = useState();

    // Effects
    useMemo(() => {
        if (isSignedIn) {
            getTicketComments(ticketId).then(res => {
                setTicketComments(res);
                const customerTicketsId = getLastCustomerTicketId([...res]);
                setLastCustomerTicketId(customerTicketsId);
                const attachments = getAttachments([...res]);
                setAttachments(attachments);
            });
        }
    }, [isSignedIn, ticketId]);

    useEffect(() => {
        const objDiv = document.getElementById('chatContainer');
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        setTimeout(() => {
            if (objDiv) {
                objDiv.scrollTop = objDiv.scrollHeight;
            }
        }, 500);
    }, [ticketComments]);

    // Methods
    const handleOutsideClick = event => {
        const path = event.path || (event.composedPath && event.composedPath());
        if (isEmojiPickerOpen && !path.includes(document.getElementById('emojiPicker'))) {
            setIsEmojiPickerOpen(false);
        }
    };
    document.addEventListener('mousedown', handleOutsideClick, false);

    const onEmojiClick = emojiObject => {
        setComment(prevComment => prevComment + emojiObject.emoji);
    };

    const getLastCustomerTicketId = comments => {
        let agentTicketFound = false;
        const lastCustomerTicketId = [];

        comments.reverse().forEach(comment => {
            if (comment.sender === 'Customer' && !agentTicketFound) {
                lastCustomerTicketId.push(comment.id);
            } else {
                agentTicketFound = true;
            }
        });

        return lastCustomerTicketId;
    };

    const getAttachments = comments => {
        const attachments = [];

        comments.forEach(comment => {
            if (comment.attachments.length > 0) {
                comment.attachments.forEach(attachment => {
                    attachments.push({ ...attachment, created_at: comment.created_at, article_id: comment.id });
                });
            }
        });

        return attachments.flat();
    };

    const sendCommentAndAttachments = comment => {
        if (isTicketClosed) return;

        const formattedComment = comment.replace(/\s+/g, ' ').trim(); // Remove extra spaces and trim
        const tempFilesUploaded = filesUploaded;
        setFilesUploaded([]);
        sendComment(ticketId, formattedComment, tempFilesUploaded, isTicketClosed).then(res => {
            setTicketComments(prevTicketsComments => [...prevTicketsComments, res]);
            setLastCustomerTicketId(prevLastCustomerTicketId => [...prevLastCustomerTicketId, res.id]);
            res.attachments.length > 0 &&
                setAttachments(prevAttachments => {
                    const newAttachments = [...prevAttachments];
                    res.attachments.forEach(attachment => {
                        newAttachments.push({ ...attachment, article_id: res.id, created_at: res.created_at });
                    });
                    return newAttachments;
                });
        });
    };

    return {
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
    };
};
