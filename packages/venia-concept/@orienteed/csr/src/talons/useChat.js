import { useRef, useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getTicketComments from '../../services/tickets/ticket_articles/getTicketComments';
import sendComment from '../../services/tickets/ticket_articles/sendComment';

export const useChat = props => {
    const { ticketId } = props;
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    // Translations
    const attachedFilesText = formatMessage({ id: 'csr.attachedFile', defaultMessage: 'Attached file/s...' });

    // Refs
    const lastMessageRef = useRef(null);

    // States
    const [ticketComments, setTicketComments] = useState();
    const [lastCustomerTicketsId, setLastCustomerTicketId] = useState();
    const [attachments, setAttachments] = useState([]);

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
        setTimeout(() => {
            scrollToBottom();
        }, 1000);
    }, [ticketComments]);

    // Methods
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
                    attachments.push({ ...attachment, created_at: comment.created_at });
                });
            }
        });

        return attachments.flat();
    };

    const scrollToBottom = () => {
        lastMessageRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    };

    const sendCommentAndAttachments = comment => {
        sendComment(ticketId, comment, [], attachedFilesText).then(res => {
            setTicketComments(prevTicketsComments => [...prevTicketsComments, res]);
            setLastCustomerTicketId(prevLastCustomerTicketId => [...prevLastCustomerTicketId, res.id]);
            setAttachments(prevAttachments => [...prevAttachments, res.attachments]);
        });
    };

    return { ticketComments, lastCustomerTicketsId, attachments, lastMessageRef, sendCommentAndAttachments };
};
