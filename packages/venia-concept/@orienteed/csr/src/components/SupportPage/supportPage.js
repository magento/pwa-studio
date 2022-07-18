/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Form } from 'informed';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import CreateTicketModal from '../CreateTicketModal/createTicketModal';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LegendModal from '../LegendModal/legendModal';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import ResetButton from '@magento/venia-ui/lib/components/OrderHistoryPage/resetButton';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import TicketItem from '../TicketItem/ticketItem';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useSupportPage } from '@magento/venia-concept/@orienteed/csr/src/talons/useSupportPage';

import defaultClasses from './supportPage.module.css';

import closeIcon from '../CreateTicketModal/Dropzone/Icons/close.svg';
import enhancementIcon from './Icons/enhancementIcon.svg';
import grid from './Icons/grid.svg';
import gridSelected from './Icons/gridSelected.svg';
import infoIcon from './Icons/infoIcon.svg';
import list from './Icons/list.svg';
import listSelected from './Icons/listSelected.svg';
import noCoursesImage from '@magento/venia-concept/@orienteed/lms/src/components/CoursesCatalog/Icons/noCourses.svg';
import orderIcon from './Icons/orderIcon.svg';
import supportIcon from './Icons/supportIcon.svg';
import { Search as SearchIcon, ArrowRight as SubmitIcon } from 'react-feather';

const DELIMITER = '/';

const ContentDialog = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useSupportPage();
    const {
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
        setTicketModal,
        setTickets,
        setView,
        states,
        successToast,
        ticketCount,
        ticketModal,
        tickets,
        view
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

    const emptyTicketsMessage = (
        <div className={classes.emptyTicketsAdviceContainer}>
            <img src={noCoursesImage} className={classes.noCoursesImage} alt="No courses icon" />
            <div>
                <p className={classes.emptyTicketsAdviceText}>
                    {searchText === '' ? (
                        <FormattedMessage
                            id={'csr.emptyTicketsAdvice'}
                            defaultMessage={"Oops... Looks like you haven't opened any tickets yet"}
                        />
                    ) : (
                        <FormattedMessage
                            id={'csr.emptyTicketsSearchAdvice'}
                            defaultMessage={'Oops... It seems that no tickets were found related to {searchText}'}
                            values={{ searchText }}
                        />
                    )}
                </p>
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

    const selectView = (
        <div className={classes.viewContainer}>
            <img
                src={view === 'grid' ? gridSelected : grid}
                className={classes.viewButton}
                onClick={() => {
                    setView('grid');
                }}
                alt="Change to grid view"
            />
            <img
                src={view === 'list' ? listSelected : list}
                className={classes.viewButton}
                onClick={() => {
                    setView('list');
                }}
                alt="Change to list view"
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
                {selectView}
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
                {selectView}
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

    return (
        <div className={classes.container}>
            {breadcrumbs}
            <div className={classes.bodyContainer}>
                <h1 className={classes.pageTitle}>{supportTitle}</h1>

                {ticketCount === undefined || tickets === undefined || groups === undefined || states === undefined ? (
                    <LoadingIndicator children={loadingIndicatorText} />
                ) : ticketCount !== 0 ? (
                    <>
                        {actionsDesktopContainer}
                        {actionsMobileContainer}
                        <div className={view === 'list' ? classes.ticketsContainerList : classes.ticketsContainerGrid}>
                            {tickets.map(ticket => {
                                return (
                                    <TicketItem
                                        groups={groups}
                                        key={ticket.id}
                                        states={states}
                                        ticket={ticket}
                                        view={view}
                                    />
                                );
                            })}
                        </div>
                    </>
                ) : (
                    emptyTicketsMessage
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
                setErrorToast={setErrorToast}
                setSuccessToast={setSuccessToast}
                setTicketModal={setTicketModal}
                setTickets={setTickets}
            />
            {successToast && successToastContainer}
            {errorToast && errorToastContainer}
        </div>
    );
};

export default ContentDialog;
