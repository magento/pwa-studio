import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import catalogActions, { serialize } from 'src/actions/catalog';
import { withRouter } from 'react-router-dom';
import { closeDrawer } from 'src/actions/app';
import classify from 'src/classify';
import defaultClasses from './filterFooter.css';
import { compose } from 'redux';
import { connect } from 'react-redux';
import isObjectEmpty from 'src/util/isObjectEmpty';

class FilterFooter extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            resetButton: PropTypes.string,
            resetButtonDisabled: PropTypes.string,
            applyButton: PropTypes.string,
            applyButtonDisabled: PropTypes.string,
            footer: PropTypes.string
        }),
        history: PropTypes.object,
        filterClear: PropTypes.func,
        chosenFilterOptions: PropTypes.object,
        closeDrawer: PropTypes.func
    };

    getPageQueryParam = () => {
        const { location } = this.props;
        const { search } = location;
        const queryParams = new URLSearchParams(search);
        const pageNumber = queryParams.get('page');
        const newQueryParams = new URLSearchParams();
        newQueryParams.set('page', pageNumber);
        return newQueryParams;
    };

    resetFilterOptions = () => {
        const { history, filterClear } = this.props;
        const queryParams = this.getPageQueryParam();
        console.log('queryParams.toString()', queryParams.toString());
        queryParams
            ? history.push('?' + queryParams.toString())
            : history.push();
        filterClear();
    };

    handleApplyFilters = () => {
        const { history, chosenFilterOptions, closeDrawer } = this.props;
        const queryParams = this.getPageQueryParam();
        history.push(
            '?' + queryParams.toString() + '&' + serialize(chosenFilterOptions)
        );
        closeDrawer();
    };

    getFooterButtons = areOptionsPristine => {
        const { classes } = this.props;

        const resetButtonClass = areOptionsPristine
            ? classes.resetButtonDisabled
            : classes.resetButton;

        const applyButtonClass = areOptionsPristine
            ? classes.applyButtonDisabled
            : classes.applyButton;

        return (
            <Fragment>
                <button
                    onClick={this.resetFilterOptions}
                    disabled={areOptionsPristine}
                    className={resetButtonClass}
                >
                    Reset Filters
                </button>
                <button
                    onClick={this.handleApplyFilters}
                    disabled={areOptionsPristine}
                    className={applyButtonClass}
                >
                    Apply Filters
                </button>
            </Fragment>
        );
    };

    render() {
        const { classes, chosenFilterOptions } = this.props;
        const footerButtons = this.getFooterButtons(
            isObjectEmpty(chosenFilterOptions)
        );

        return <div className={classes.footer}>{footerButtons}</div>;
    }
}

const mapStateToProps = ({ catalog }) => {
    const { chosenFilterOptions } = catalog;

    return {
        chosenFilterOptions: chosenFilterOptions
    };
};

const mapDispatchToProps = {
    filterClear: catalogActions.filterOption.clear,
    closeDrawer: closeDrawer
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FilterFooter);
