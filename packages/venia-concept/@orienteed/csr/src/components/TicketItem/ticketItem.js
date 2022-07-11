import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './ticketItem.module.css';

import supportIcon from '@magento/venia-concept/@orienteed/csr/src/components/SupportPage/Icons/supportIcon.svg';
import enhancementIcon from '@magento/venia-concept/@orienteed/csr/src/components/SupportPage/Icons/enhancementIcon.svg';
import orderIcon from '@magento/venia-concept/@orienteed/csr/src/components/SupportPage/Icons/orderIcon.svg';
import messageIcon from './Icons/messageIcon.svg';

const TicketItem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { groups, states, ticket, view } = props;
    const { formatMessage } = useIntl();

    // Texts
    const ticketNumberText = formatMessage({ id: 'csr.ticketNumber', defaultMessage: 'Ticket number' });
    const creationDateText = formatMessage({ id: 'csr.creationDate', defaultMessage: 'Creation date' });
    const closedDateText = formatMessage({ id: 'csr.closedDate', defaultMessage: 'Closed date' });
    const lastUpdateDateText = formatMessage({ id: 'csr.lastUpdateDate', defaultMessage: 'Last update date' });
    const summaryText = formatMessage({ id: 'csr.summary', defaultMessage: 'Summary' });
    const stateText = formatMessage({ id: 'csr.state', defaultMessage: 'State' });

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
            .getDay()
            .toString()
            .padStart(2, '0');
        const month = months[date.getMonth() - 1];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const ticketItemList = (
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
                <p className={classes.fieldState}>{states[ticket.state_id]}</p>
            </div>
            <div className={classes.messageContainer}>
                <img src={messageIcon} className={classes.messageIcon} alt="Message icon" />
                <span className={classes.messageText}>{ticket.article_count}</span>
            </div>
        </div>
    );

    const ticketItemGrid = (
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
                    <div className={classes.ticketGridItem}>
                        <p className={classes.fieldTitle}>{stateText}</p>
                        <p className={classes.fieldStateGrid}>{states[ticket.state_id]}</p>
                    </div>
                </div>
            </div>
            <div className={classes.ticketGridBodyContainer}>
                <div className={classes.ticketGridSummaryItem}>
                    <p className={classes.fieldTitle}>{summaryText}</p>
                    <p className={classes.fieldSummaryGrid}>{ticket.title}</p>
                </div>
                <div className={classes.messageContainer}>
                    <img src={messageIcon} className={classes.messageIcon} alt="Message icon" />
                    <span className={classes.messageText}>{ticket.article_count}</span>
                </div>
            </div>
        </div>
    );

    return view === 'list' ? ticketItemList : ticketItemGrid;
};

export default TicketItem;
