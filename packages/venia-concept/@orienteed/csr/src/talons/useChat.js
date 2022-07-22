import { useState, useEffect } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getTicketComments from '../../services/tickets/ticket_articles/getTicketComments';

export const useChat = props => {
    const { ticketId } = props;
    const [{ isSignedIn }] = useUserContext();

    // States
    const [ticketComments, setTicketComments] = useState();
    const [attachments, setAttachments] = useState([]);

    // Effects
    useEffect(() => {
        if (isSignedIn) {
            getTicketComments(ticketId).then(res => {
                setTicketComments(res);
            });
        }
    }, [isSignedIn, ticketId]);

    // Methods

    return { ticketComments };
};
