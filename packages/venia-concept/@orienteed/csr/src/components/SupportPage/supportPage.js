/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import CreateTicketModal from '../CreateTicketModal/createTicketModal';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LegendModal from './LegendModal/legendModal';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import ResetButton from '@magento/venia-ui/lib/components/OrderHistoryPage/resetButton';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TicketItem from '../TicketItem/ticketItem';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useSupportPage } from '@magento/venia-concept/@orienteed/csr/src/talons/useSupportPage';

import defaultClasses from './supportPage.module.css';

import closeIcon from '../CreateTicketModal/Dropzone/Icons/close.svg';
import enhancementIcon from './Icons/enhancementIcon.svg';
import infoIcon from './Icons/infoIcon.svg';
import emptyTicketsIcon from '@magento/venia-concept/@orienteed/lms/src/components/CoursesCatalog/Icons/noCourses.svg';
import orderIcon from './Icons/orderIcon.svg';
import supportIcon from './Icons/supportIcon.svg';
import { Search as SearchIcon, ArrowRight as SubmitIcon } from 'react-feather';
import TicketSort from '../TicketSort/ticketSort';
import { useSortTicket } from '../../talons/useSortTicket.js';
import TicketFilter from '../TicketFilter/ticketFilter';
import { useFilterTicket } from '../../talons/useFilterTicket.js';

const DELIMITER = '/';
const PAGE_SIZE = 8;

const ContentDialog = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useSupportPage();
    const {
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
        states,
        successToast,
        ticketCount,
        ticketModal,
        tickets
    } = talonProps;
    const { formatMessage } = useIntl();

    // Texts
    const supportTitle = formatMessage({ id: 'csr.supportTitle', defaultMessage: 'Support page' });
    const createTicketText = formatMessage({ id: 'csr.createTicket', defaultMessage: 'Create a ticket' });
    const searchPlaceholder = formatMessage({
        id: 'csr.search',
        defaultMessage: 'Search ticket'
    });
    const supportIssueText = formatMessage({ id: 'csr.supportIssue', defaultMessage: 'Support issue' });
    const orderIssueText = formatMessage({ id: 'csr.orderIssue', defaultMessage: 'Order issue' });
    const enhancementText = formatMessage({ id: 'csr.enhancement', defaultMessage: 'Enhancement' });
    const loadingIndicatorText = formatMessage({ id: 'loadingIndicator.message', defaultMessage: 'Fetching Data...' });

    const sortProps = useSortTicket();
    const filterProps = useFilterTicket();

    // Icons
    const searchIcon = <Icon src={SearchIcon} size={24} />;
    const submitIcon = (
        <Icon
            src={SubmitIcon}
            size={24}
            classes={{
                icon: classes.submitIcon
            }}
        />
    );

    // Components
    const breadcrumbs = (
        <nav className={classes.root} aria-live="polite" aria-busy="false">
            <BrowserRouter forceRefresh={true}>
                <Link className={classes.link} to="/">
                    <FormattedMessage id={'global.home'} defaultMessage={'Home'} />
                </Link>
            </BrowserRouter>
            <span className={classes.divider}>{DELIMITER}</span>
            <span className={classes.currentPage}>{supportTitle}</span>
        </nav>
    );

    const getEmptyTicketsMessage = () => {
        if (searchText === '' && (filterByStatus.length === 0 && filterByType.length === 0)) {
            return (
                <FormattedMessage
                    id={'csr.emptyTicketsAdvice'}
                    defaultMessage={"Oops... Looks like you haven't opened any tickets yet"}
                />
            );
        }
        if (searchText === '' && (filterByType.length !== 0 || filterByStatus.length !== 0)) {
            return (
                <FormattedMessage
                    id={'csr.emptyTicketsFilterAdvice'}
                    defaultMessage={"'Oops... It seems that no tickets were found related to your filters"}
                />
            );
        }
        if (searchText !== '' && (filterByStatus.length === 0 && filterByType.length === 0)) {
            return (
                <FormattedMessage
                    id={'csr.emptyTicketsSearchAdvice'}
                    defaultMessage={"'Oops... It seems that no tickets were found related to ''{searchText}''"}
                    values={{ searchText }}
                />
            );
        }
    };

    const emptyTicketsMessage = (
        <div className={classes.emptyTicketsAdviceContainer}>
            <img src={emptyTicketsIcon} className={classes.emptyTicketsAdviceImage} alt="Empty tickets icon" />
            <div>
                <p className={classes.emptyTicketsAdviceText}>{getEmptyTicketsMessage()}</p>
            </div>
            <Button
                className={classes.primaryButton}
                onClick={() => {
                    openTicketModal();
                }}
            >
                {createTicketText}
            </Button>
        </div>
    );

    const resetButtonElement = searchText ? <ResetButton onReset={handleReset} /> : null;

    const createTicketButton = (
        <Button
            className={classes.createTicketButton}
            onClick={() => {
                openTicketModal();
            }}
        >
            {createTicketText}
        </Button>
    );

    const searchBar = (
        <Form className={classes.search} onSubmit={handleSubmit}>
            <TextInput
                after={resetButtonElement}
                before={searchIcon}
                disabled={tickets === undefined || ticketCount <= 1}
                field="search"
                id={classes.search}
                placeholder={searchPlaceholder}
            />
            <Button
                className={classes.searchButton}
                disabled={tickets === undefined || ticketCount <= 1}
                priority={'high'}
                type="submit"
            >
                {submitIcon}
            </Button>
        </Form>
    );

    const legendDesktop = (
        <div className={classes.legendDesktopContainer}>
            <div className={classes.legendItem}>
                <img src={supportIcon} className={classes.legendDesktopIcon} alt="Support icon" />
                <p>{supportIssueText}</p>
            </div>
            <div className={classes.legendItem}>
                <img src={orderIcon} className={classes.legendDesktopIcon} alt="Support icon" />
                <p>{orderIssueText}</p>
            </div>
            <div className={classes.legendItem}>
                <img src={enhancementIcon} className={classes.legendDesktopIcon} alt="Support icon" />
                <p>{enhancementText}</p>
            </div>
        </div>
    );

    const legendMobile = (
        <div className={classes.legendMobileContainer}>
            <img
                src={infoIcon}
                className={classes.legendMobileIcon}
                onClick={() => {
                    setLegendModal(true);
                }}
                alt="Information icon"
            />
        </div>
    );

    const actionsDesktopContainer = (
        <div className={classes.actionsDesktopContainer}>
            <div className={classes.actionsDesktopRow}>
                {createTicketButton}
                {searchBar}
            </div>
            <div className={classes.actionsDesktopRow}>
                {legendDesktop}
                <div className={classes.SortFilterContainer}>
                    <TicketFilter
                        filterProps={filterProps}
                        setFilterByType={setFilterByType}
                        setFilterByStatus={setFilterByStatus}
                        setNumPage={setNumPage}
                        setMultipleTickets={setMultipleTickets}
                    />
                    <TicketSort
                        sortProps={sortProps}
                        setMultipleTickets={setMultipleTickets}
                        setOrderBy={setOrderBy}
                        setNumPage={setNumPage}
                        setSortBy={setSortBy}
                    />
                </div>
            </div>
        </div>
    );

    const actionsMobileContainer = (
        <div className={classes.actionsMobileContainer}>
            <div className={classes.actionsMobileFirstRow}>
                {createTicketButton}
                {legendMobile}
            </div>
            <div className={classes.actionsMobileSecondRow}>
                {searchBar}
                <TicketFilter
                    filterProps={filterProps}
                    setFilterByType={setFilterByType}
                    setFilterByStatus={setFilterByStatus}
                    setNumPage={setNumPage}
                    setMultipleTickets={setMultipleTickets}
                />
                <TicketSort
                    sortProps={sortProps}
                    setMultipleTickets={setMultipleTickets}
                    setOrderBy={setOrderBy}
                    setNumPage={setNumPage}
                    setSortBy={setSortBy}
                />
            </div>
        </div>
    );

    const successToastContainer = (
        <div className={classes.successToastContainer}>
            <p className={classes.successToastText}>
                <FormattedMessage id={'csr.ticketCreated'} defaultMessage={'Ticket created successfully'} />
            </p>
            <img
                alt="Close icon"
                className={classes.toastCloseIcon}
                onClick={() => setSuccessToast(false)}
                src={closeIcon}
            />
        </div>
    );

    const errorToastContainer = (
        <div className={classes.errorToastContainer}>
            <p className={classes.errorToastText}>
                <FormattedMessage
                    id={'csr.errorToast'}
                    defaultMessage={'Sorry, there has been an error.{br}Please, try again later.'}
                    values={{ br: <br /> }}
                />
            </p>
            <img
                alt="Close icon"
                className={classes.toastCloseIcon}
                onClick={() => setErrorToast(false)}
                src={closeIcon}
            />
        </div>
    );

    const loadMoreButton = (
        <Button
            className={classes.loadMoreButton}
            disabled={tickets === undefined || ticketCount < numPage[0] * PAGE_SIZE}
            onClick={() => handleLoadMore()}
        >
            <FormattedMessage id={'csr.loadMore'} defaultMessage={'Load more'} />
        </Button>
    );

    return (
        <div className={classes.container}>
            {breadcrumbs}
            <div className={classes.bodyContainer}>
                <h1 className={classes.pageTitle}>{supportTitle}</h1>

                {ticketCount === undefined || tickets === undefined || groups === undefined || states === undefined ? (
                    <LoadingIndicator children={loadingIndicatorText} />
                ) : tickets.length !== 0 ? (
                    <>
                        {actionsDesktopContainer}
                        {actionsMobileContainer}
                        <div className={classes.ticketsContainer}>
                            {tickets.map(ticket => {
                                return (
                                    <TicketItem
                                        groups={groups}
                                        key={ticket.id}
                                        openedChat={openedChat}
                                        setOpenedChat={setOpenedChat}
                                        states={states}
                                        ticket={ticket}
                                        setTickets={setTickets}
                                    />
                                );
                            })}
                        </div>
                        {tickets.length !== 0 && loadMoreButton}
                    </>
                ) : (
                    <>
                        {actionsDesktopContainer}
                        {actionsMobileContainer}
                        {emptyTicketsMessage}
                    </>
                )}
            </div>
            <LegendModal
                isOpen={legendModal}
                onConfirm={() => {
                    setLegendModal(false);
                }}
            />
            <CreateTicketModal
                isOpen={ticketModal}
                orderBy={orderBy}
                setErrorToast={setErrorToast}
                setSuccessToast={setSuccessToast}
                setTicketCount={setTicketCount}
                setTicketModal={setTicketModal}
                setTickets={setTickets}
            />
            {successToast && successToastContainer}
            {errorToast && errorToastContainer}
        </div>
    );
};

export default ContentDialog;
