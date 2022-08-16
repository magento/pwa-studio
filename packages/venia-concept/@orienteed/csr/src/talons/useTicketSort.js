export const useTicketSort = props => {
    const { setMultipleTickets, setOrderBy, setNumPage, setSortBy } = props;

    const orderByFunction = currentSort => {
        setMultipleTickets(false);
        setOrderBy(currentSort.sortDirection);
        setSortBy(currentSort.attribute);
        setNumPage([1]);
    };

    return {
        orderByFunction
    };
};
