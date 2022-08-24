import { useState, useEffect } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import getStates from '../../services/tickets/ticket_states/getStates';
import getGroups from '../../services/groups/getGroups';

export const useTicketFilter = props => {
    const [{ isSignedIn }] = useUserContext();

    const { setFilterByStatus, setFilterByType, setNumPage, setMultipleTickets } = props;
    const [activeFilterByType, setActiveFilterByType] = useState([]);
    const [activeFilterByStatus, setActiveFilterByStatus] = useState([]);
    const [states, setStates] = useState();
    const [groups, setGroups] = useState();

    useEffect(() => {
        if (isSignedIn) {
            getStates().then(res => {
                setStates(res);
            });
            getGroups().then(res => {
                setGroups(res);
            });
        }
    }, [isSignedIn]);

    const filterByFunction = filterId => {
        if (filterId.attribute === 'type') {
            if (activeFilterByType.includes(filterId.groupId) == false) {
                setFilterByType([...activeFilterByType, filterId.groupId]);
            } else {
                setFilterByType(activeFilterByType.filter(item => item !== filterId.groupId));
            }
        } else {
            if (activeFilterByStatus.includes(filterId.groupId) == false) {
                setFilterByStatus([...activeFilterByStatus, filterId.groupId]);
            } else {
                setFilterByStatus(activeFilterByStatus.filter(item => item !== filterId.groupId));
            }
        }
        setMultipleTickets(false);
        setNumPage([1]);
    };

    return {
        activeFilterByStatus,
        activeFilterByType,
        filterByFunction,
        groups,
        setActiveFilterByStatus,
        setActiveFilterByType,
        states
    };
};
