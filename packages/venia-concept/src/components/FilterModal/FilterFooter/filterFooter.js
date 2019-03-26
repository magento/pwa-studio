import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import catalogActions, { serialize } from 'src/actions/catalog';
import { withRouter } from 'react-router-dom';
import classify from 'src/classify';
import defaultClasses from './filterFooter.css';
import { compose } from 'redux';
import { connect } from 'react-redux';

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
        closeModalHandler: PropTypes.func
    };

    static getDerivedStateFromProps(nextProps) {
        const { chosenFilterOptions } = nextProps;
        let filterOptionsArePristine = true;

        for (const optionName in chosenFilterOptions) {
            if (chosenFilterOptions[optionName].length > 0) {
                filterOptionsArePristine = false;
                break;
            }
        }

        return { areOptionsPristine: filterOptionsArePristine };
    }

    state = {
        areOptionsPristine: true
    };

    resetFilterOptions = () => {
        const { history, filterClear } = this.props;
        history.push();
        filterClear();
    };

    handleApplyFilters = () => {
        const { history, chosenFilterOptions, closeModalHandler } = this.props;
        history.push('?' + serialize(chosenFilterOptions));
        closeModalHandler();
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
        const { areOptionsPristine } = this.state;
        const { classes } = this.props;
        const footerButtons = this.getFooterButtons(areOptionsPristine);

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
    filterClear: catalogActions.filterOption.clear
};

export default compose(
    withRouter,
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(FilterFooter);
