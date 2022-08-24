import { useState, useEffect, useCallback } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getTickets from '../../services/tickets/getTickets';
import getGroups from '../../services/groups/getGroups';
import getStates from '../../services/tickets/ticket_states/getStates';

export const useSupportPage = () => {
    const [{ isSignedIn }] = useUserContext();

    // States
    const [errorToast, setErrorToast] = useState(false);
    const [groups, setGroups] = useState();
    const [legendModal, setLegendModal] = useState(false);
    const [numPage, setNumPage] = useState([1]);
    const [multipleTickets, setMultipleTickets] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [orderBy, setOrderBy] = useState('desc');
    const [states, setStates] = useState();
    const [successToast, setSuccessToast] = useState(false);
    const [ticketCount, setTicketCount] = useState(0);
    const [ticketModal, setTicketModal] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [sortBy, setSortBy] = useState('created_at');
    const [filterByStatus, setFilterByStatus] = useState([]);
    const [filterByType, setFilterByType] = useState([]);
    const [openedChat, setOpenedChat] = useState([-1]);

    useEffect(() => {
        if (isSignedIn) {
            getGroups().then(res => {
                setGroups(res);
            });
            getStates().then(res => {
                setStates(res);
            });
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (isSignedIn) {
            const filters = { status: filterByStatus, type: filterByType };
            getTickets(orderBy, numPage, '', sortBy, filters).then(res => {
                const newTickets =
                    res.tickets.length !== 0
                        ? orderBy === 'desc'
                            ? Object.values(res.assets.Ticket).reverse()
                            : Object.values(res.assets.Ticket)
                        : res.tickets;
                setTicketCount(prevTicketCount =>
                    multipleTickets ? prevTicketCount + res.tickets_count : res.tickets_count
                );
                setTickets(prevTickets => {
                    if (multipleTickets) {
                        return [
                            ...prevTickets,
                            ...newTickets.filter(ticket => !prevTickets.some(prevTicket => prevTicket.id === ticket.id))
                        ];
                    } else {
                        return newTickets;
                    }
                });
            });
        }
    }, [isSignedIn, numPage, filterByStatus, filterByType]); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Methods
    const changeOrderBy = () => {
        setMultipleTickets(false);
        setOrderBy(prevOrderBy => (prevOrderBy === 'asc' ? 'desc' : 'asc'));
        setNumPage([1]);
    };

    const handleLoadMore = () => {
        setMultipleTickets(true);
        setNumPage(prevNumPage => [prevNumPage[0] + 1]);
    };

    const openTicketModal = () => {
        setTicketModal(true);
    };

    const handleReset = useCallback(() => {
        setSearchText('');
        if (isSignedIn) {
            getTickets(orderBy, 1, '').then(res => {
                setTicketCount(res.tickets_count);
                setTickets(
                    res.tickets.length !== 0
                        ? orderBy === 'desc'
                            ? Object.values(res.assets.Ticket).reverse()
                            : Object.values(res.assets.Ticket)
                        : res.tickets
                );
            });
        }
    }, [isSignedIn, orderBy]);

    const handleSubmit = useCallback(
        ({ search }) => {
            setSearchText(search);
            if (isSignedIn) {
                getTickets(orderBy, 1, search).then(res => {
                    setTicketCount(res.tickets_count);
                    setTickets(
                        res.tickets.length !== 0
                            ? orderBy === 'desc'
                                ? Object.values(res.assets.Ticket).reverse()
                                : Object.values(res.assets.Ticket)
                            : res.tickets
                    );
                });
            }
        },
        [isSignedIn, orderBy]
    );

    return {
        changeOrderBy,
        errorToast,
        filterByStatus,
        filterByType,
        groups,
        handleLoadMore,
        handleReset,
        handleSubmit,
        legendModal,
        numPage,
        openTicketModal,
        openedChat,
        orderBy,
        searchText,
        setErrorToast,
        setFilterByStatus,
        setFilterByType,
        setLegendModal,
        setMultipleTickets,
        setNumPage,
        setOpenedChat,
        setOrderBy,
        setSortBy,
        setSuccessToast,
        setTicketCount,
        setTicketModal,
        setTickets,
        sortBy,
        states,
        successToast,
        ticketCount,
        ticketModal,
        tickets
    };
};
