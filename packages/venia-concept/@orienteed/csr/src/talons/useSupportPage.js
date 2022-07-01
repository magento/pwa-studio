import { useState, useEffect, useCallback } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getTickets from '../../services/tickets/getTickets';
import getGroups from '../../services/groups/getGroups';
import getStates from '../../services/tickets/ticket_states/getStates';

export const useSupportPage = () => {
    // States
    const [groups, setGroups] = useState();
    const [legendModal, setLegendModal] = useState(false);
    const [ticketModal, setTicketModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [states, setStates] = useState();
    const [ticketCount, setTicketCount] = useState();
    const [tickets, setTickets] = useState();
    const [view, setView] = useState('list');
    const [{ isSignedIn }] = useUserContext();

    // Methods
    useEffect(() => {
        if (isSignedIn) {
            getGroups().then(res => {
                setGroups(res);
            });
            getStates().then(res => {
                setStates(res);
            });
            getTickets().then(res => {
                setTicketCount(res.tickets_count);
                setTickets(res.assets.Ticket);
            });
        }
    }, [isSignedIn]);

    const openTicketModal = () => {
        setTicketModal(true);
    };

    const handleReset = useCallback(() => {
        setSearchText('');
    }, []);

    const handleSubmit = useCallback(({ search }) => {
        setSearchText(search);
    }, []);

    return {
        groups,
        handleReset,
        handleSubmit,
        legendModal,
        openTicketModal,
        searchText,
        setLegendModal,
        setTicketModal,
        setView,
        states,
        ticketCount,
        ticketModal,
        tickets,
        view,
    };
};
