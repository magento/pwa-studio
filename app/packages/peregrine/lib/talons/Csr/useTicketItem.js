/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from 'react';
import updateTicket from '../../RestApi/Csr/tickets/updateTicket';

export const useTicketItem = props => {
    const { setTickets, openedChat, ticket } = props;

    // Refs
    const ticketDesktopRef = useRef();
    const ticketMobileRef = useRef();

    // States
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    // Effects
    useEffect(() => {
        if (openedChat[0] === ticket.number) {
            setTimeout(() => {
                if (window.innerWidth > 700) {
                    ticketDesktopRef?.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
                } else {
                    const ticketHeight = ticketMobileRef?.current?.offsetHeight;
                    const ticketTop = ticketMobileRef?.current?.offsetTop;
                    window.scrollTo(0, ticketHeight + ticketTop - window.innerHeight + 20);
                }
            }, 1000);
        }
    }, [openedChat]);

    // Methods
    const changeTicketState = (ticketId, state) => {
        updateTicket(ticketId, state).then(res =>
            setTickets(prevTickets => {
                const newTickets = [...prevTickets];
                const ticketIndex = newTickets.findIndex(ticket => ticket.id === ticketId);
                newTickets[ticketIndex] = res;
                return newTickets;
            })
        );
        setIsConfirmationModalOpen(false);
    };

    return {
        changeTicketState,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        ticketDesktopRef,
        ticketMobileRef
    };
};
