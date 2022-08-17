import { useState } from 'react';

export const useTicketFilter = props => {   

    const { setFilterByStatus, setFilterByType } = props;
    const [activeFilterByType, setActiveFilterByType] = useState([]);
    const [activeFilterByStatus, setActiveFilterByStatus] = useState([]);


    const filterByFunction = (filterId) =>{        
        if (filterId.attribute === 'type') {  
            if (activeFilterByType.includes(filterId.groupId) == false) {
                setFilterByType([...activeFilterByType, filterId.groupId]);
            }
            else {
                setFilterByType(activeFilterByType.filter(item => item !== filterId.groupId));
            }
        } else {
            if (activeFilterByStatus.includes(filterId.groupId) == false) {
                setFilterByStatus([...activeFilterByStatus, filterId.groupId]);
            }
            else {
                setFilterByStatus(activeFilterByStatus.filter(item => item !== filterId.groupId));
            }
        }
        
    }

    return {
        filterByFunction,
        activeFilterByType,
        setActiveFilterByType,
        activeFilterByStatus,
        setActiveFilterByStatus,
    };
};