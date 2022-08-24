import updateTicket from '../../services/tickets/updateTicket';

export const useTicketItem = props => {
    const { setTickets } = props;

    const changeTicketState = (ticketId, state) => {
        updateTicket(ticketId, state).then(res =>
            setTickets(prevTickets => {
                const newTickets = [...prevTickets];
                const ticketIndex = newTickets.findIndex(ticket => ticket.id === ticketId);
                newTickets[ticketIndex] = res;
                return newTickets;
            })
        );
    };

    return {
        changeTicketState
    };
};
