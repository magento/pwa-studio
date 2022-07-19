import { useState, useEffect, useCallback } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getTickets from '../../services/tickets/getTickets';
import getGroups from '../../services/groups/getGroups';
import getStates from '../../services/tickets/ticket_states/getStates';

export const useSupportPage = () => {
    // States
    const [errorToast, setErrorToast] = useState(false);
    const [groups, setGroups] = useState();
    const [legendModal, setLegendModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [states, setStates] = useState();
    const [successToast, setSuccessToast] = useState(false);
    const [ticketCount, setTicketCount] = useState();
    const [ticketModal, setTicketModal] = useState(false);
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
                setTickets(res.tickets.length !== 0 ? Object.values(res.assets.Ticket).reverse() : res.tickets);
            });
        }
    }, [isSignedIn]);

    const openTicketModal = () => {
        setTicketModal(true);
    };

    const handleReset = useCallback(() => {
        setSearchText('');
        if (isSignedIn) {
            getTickets().then(res => {
                setTicketCount(res.tickets_count);
                setTickets(res.tickets.length !== 0 ? Object.values(res.assets.Ticket).reverse() : res.tickets);
            });
        }
    }, [isSignedIn]);

    const handleSubmit = useCallback(
        ({ search }) => {
            setSearchText(search);
            if (isSignedIn) {
                getTickets(search).then(res => {
                    setTicketCount(res.tickets_count);
                    setTickets(res.tickets.length !== 0 ? Object.values(res.assets.Ticket).reverse() : res.tickets);
                });
            }
        },
        [isSignedIn]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSuccessToast(false);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [successToast]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrorToast(false);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [errorToast]);

    return {
        errorToast,
        groups,
        handleReset,
        handleSubmit,
        legendModal,
        openTicketModal,
        searchText,
        setErrorToast,
        setLegendModal,
        setSuccessToast,
        setTicketCount,
        setTicketModal,
        setTickets,
        setView,
        states,
        successToast,
        ticketCount,
        ticketModal,
        tickets,
        view
    };
};
