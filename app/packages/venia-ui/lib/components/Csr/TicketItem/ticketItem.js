/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useIntl } from 'react-intl';

import Chat from '../Chat';
import ConfirmationModal from './ConfirmationModal/confirmationModal';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './ticketItem.module.css';

import supportIcon from '@magento/venia-ui/lib/assets/supportIcon.svg';
import enhancementIcon from '@magento/venia-ui/lib/assets/enhancementIcon.svg';
import orderIcon from '@magento/venia-ui/lib/assets/orderIcon.svg';
import closeIcon from '@magento/venia-ui/lib/assets/close.svg';

import { MessageIcon } from '@magento/venia-ui/lib/assets/messageIcon';
// import messageIcon from '@magento/venia-ui/lib/assets/messageIcon.svg';

import { useTicketItem } from '@magento/peregrine/lib/talons/Csr/useTicketItem.js';

const TicketItem = props => {
    const { groups, states, ticket, setTickets, openedChat, setOpenedChat } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const talonProps = useTicketItem({ setTickets, openedChat, ticket });
    const {
        changeTicketState,
        isConfirmationModalOpen,
        setIsConfirmationModalOpen,
        ticketDesktopRef,
        ticketMobileRef
    } = talonProps;

    // Texts
    const closeText = formatMessage({ id: 'csr.close', defaultMessage: 'close' });
    const closeTicketsText = formatMessage({ id: 'csr.closeTicket', defaultMessage: 'Close ticket' });
    const closedDateText = formatMessage({ id: 'csr.closedDate', defaultMessage: 'Closed date' });
    const creationDateText = formatMessage({ id: 'csr.creationDate', defaultMessage: 'Creation date' });
    const lastUpdateDateText = formatMessage({ id: 'csr.lastUpdateDate', defaultMessage: 'Last update date' });
    const reopenText = formatMessage({ id: 'csr.reopen', defaultMessage: 'reopen' });
    const reopenTicketsText = formatMessage({ id: 'csr.reopenTicket', defaultMessage: 'Reopen ticket' });
    const stateText = formatMessage({ id: 'csr.state', defaultMessage: 'State' });
    const summaryText = formatMessage({ id: 'csr.summary', defaultMessage: 'Summary' });
    const ticketNumberText = formatMessage({ id: 'csr.ticketNumber', defaultMessage: 'Ticket number' });
    const stateValueText = formatMessage({
        id: `csr.${states[ticket.state_id]}`,
        defaultMessage: states[ticket.state_id]
    });

    const showType = groupId => {
        switch (groups[groupId]) {
            case 'Enhancement':
                return enhancementIcon;
            case 'Order issue':
                return orderIcon;
            case 'Support issue':
                return supportIcon;
            default:
                return supportIcon;
        }
    };

    const isoDateToLocaleDate = isoDate => {
        const months = [
            formatMessage({ id: 'csr.january', defaultMessage: 'Jan' }),
            formatMessage({ id: 'csr.february', defaultMessage: 'Feb' }),
            formatMessage({ id: 'csr.march', defaultMessage: 'Mar' }),
            formatMessage({ id: 'csr.april', defaultMessage: 'Apr' }),
            formatMessage({ id: 'csr.may', defaultMessage: 'May' }),
            formatMessage({ id: 'csr.juny', defaultMessage: 'Jun' }),
            formatMessage({ id: 'csr.july', defaultMessage: 'Jul' }),
            formatMessage({ id: 'csr.august', defaultMessage: 'Aug' }),
            formatMessage({ id: 'csr.september', defaultMessage: 'Sep' }),
            formatMessage({ id: 'csr.october', defaultMessage: 'Oct' }),
            formatMessage({ id: 'csr.november', defaultMessage: 'Nov' }),
            formatMessage({ id: 'csr.december', defaultMessage: 'Dec' })
        ];

        const date = new Date(isoDate);
        const day = date
            .getDate()
            .toString()
            .padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const chatView = <Chat ticketId={ticket.id} isTicketClosed={states[ticket.state_id] === 'closed'} />;

    const ticketItemList = (
        <div ref={ticketDesktopRef} className={classes.ticketAndChatListContainer}>
            <div className={classes.ticketListContainer}>
                <img src={showType(ticket.group_id)} className={classes.ticketImage} alt="Ticket logo" />
                <div className={classes.ticketListItem}>
                    <p className={classes.fieldTitle}>{ticketNumberText}</p>
                    <p className={classes.fieldValue}>{ticket.number}</p>
                </div>

                <div className={classes.ticketListItem}>
                    <p className={classes.fieldTitle}>{creationDateText}</p>
                    <p className={classes.fieldValue}>{isoDateToLocaleDate(ticket.created_at)}</p>
                </div>
                {states[ticket.state_id] === 'closed' ? (
                    <div className={classes.ticketListItem}>
                        <p className={classes.fieldTitle}>{closedDateText}</p>
                        <p className={classes.fieldValue}>{isoDateToLocaleDate(ticket.close_at)}</p>
                    </div>
                ) : (
                    <div className={classes.ticketListItem}>
                        <p className={classes.fieldTitle}>{lastUpdateDateText}</p>
                        <p className={classes.fieldValue}>{isoDateToLocaleDate(ticket.updated_at)}</p>
                    </div>
                )}
                <div className={classes.ticketListItem}>
                    <p className={classes.fieldTitle}>{summaryText}</p>
                    <p className={classes.fieldSummary}>{ticket.title}</p>
                </div>
                <div className={classes.ticketListItem}>
                    <p className={classes.fieldTitle}>{stateText}</p>
                    <p className={classes.fieldState}>{stateValueText}</p>
                    <p className={classes.fieldChangeState} onClick={() => setIsConfirmationModalOpen(true)}>
                        {states[ticket.state_id] === 'closed' ? reopenTicketsText : closeTicketsText}
                    </p>
                </div>
                <div
                    onClick={() =>
                        setOpenedChat(prevState => (prevState[0] === ticket.number ? [-1] : [ticket.number]))
                    }
                    className={classes.messageContainer}
                >
                    {/* <img
                        src={openedChat[0] === ticket.number ? closeIcon : messageIcon}
                        className={openedChat[0] === ticket.number ? classes.closeIcon : classes.messageIcon}
                        alt="Message icon"
                    /> */}

                    {/* show an icon if the chat is open */}
                    {openedChat[0] === ticket.number ? (
                        // <div className={classes.closeIcon}>{closeIcon}</div>
                        <img src={closeIcon} className = {classes.closeIcon} alt='Icon'/>
                    ) : (
                        <div className={classes.messageIcon}>
                            <MessageIcon />
                        </div>
                    )}
                </div>
            </div>
            {openedChat[0] === ticket.number && chatView}
        </div>
    );

    const ticketItemGrid = (
        <div ref={ticketMobileRef} className={classes.ticketAndChatGridContainer}>
            <div className={classes.ticketGridContainer}>
                <div className={classes.ticketGridHeaderContainer}>
                    <img src={showType(ticket.group_id)} className={classes.ticketImageGrid} alt="Ticket logo" />
                    <div className={classes.ticketMainHeaderContainer}>
                        <div className={classes.ticketGridItem}>
                            <p className={classes.fieldTitle}>{ticketNumberText}</p>
                            <p className={classes.fieldValueGrid}>{ticket.number}</p>
                        </div>
                        <div className={classes.ticketGridItem}>
                            <p className={classes.fieldTitle}>{creationDateText}</p>
                            <p className={classes.fieldValueGrid}>{isoDateToLocaleDate(ticket.created_at)}</p>
                        </div>
                        {states[ticket.state_id] === 'closed' ? (
                            <div className={classes.ticketGridItem}>
                                <p className={classes.fieldTitle}>{closedDateText}</p>
                                <p className={classes.fieldValueGrid}>{isoDateToLocaleDate(ticket.close_at)}</p>
                            </div>
                        ) : (
                            <div className={classes.ticketGridItem}>
                                <p className={classes.fieldTitle}>{lastUpdateDateText}</p>
                                <p className={classes.fieldValueGrid}>{isoDateToLocaleDate(ticket.updated_at)}</p>
                            </div>
                        )}
                        <div className={classes.ticketGridItemState}>
                            <div className={classes.ticketGridItem}>
                                <p className={classes.fieldTitle}>{stateText}</p>
                                <p className={classes.fieldStateGrid}>{stateValueText}</p>
                            </div>
                            <p className={classes.fieldChangeState} onClick={() => setIsConfirmationModalOpen(true)}>
                                {states[ticket.state_id] === 'closed' ? reopenTicketsText : closeTicketsText}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={classes.ticketGridBodyContainer}>
                    <div className={classes.ticketGridSummaryItem}>
                        <p className={classes.fieldTitle}>{summaryText}</p>
                        <p className={classes.fieldSummaryGrid}>{ticket.title}</p>
                    </div>
                    <div
                        onClick={() =>
                            setOpenedChat(prevState => (prevState[0] === ticket.number ? [-1] : [ticket.number]))
                        }
                        className={classes.messageContainer}
                    >
                        {/* <img
                            src={openedChat[0] === ticket.number ? closeIcon : messageIcon}
                            className={openedChat[0] === ticket.number ? classes.closeIcon : classes.messageIcon}
                            alt="Message icon"
                        /> */}
                        {openedChat[0] === ticket.number ? (
                            <div className={classes.closeIcon}>{closeIcon}</div>
                        ) : (
                            <div className={classes.messageIcon}>
                                <MessageIcon />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {openedChat[0] === ticket.number && chatView}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onCancel={() => setIsConfirmationModalOpen(false)}
                onConfirm={() => changeTicketState(ticket.id, states[ticket.state_id] === 'closed' ? 'open' : 'closed')}
                nextState={states[ticket.state_id] === 'closed' ? reopenText : closeText}
                ticketNumber={ticket.number}
            />
        </div>
    );

    return (
        <>
            {ticketItemList}
            {ticketItemGrid}
        </>
    );
};

export default TicketItem;
