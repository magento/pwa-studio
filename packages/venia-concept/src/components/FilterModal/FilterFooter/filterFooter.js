import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import catalogActions from 'src/actions/catalog';
import { withRouter } from 'react-router-dom';
import classify from 'src/classify';
import { serialize } from './utils';
import defaultClasses from './filterFooter.css';
import { compose } from 'redux';
import { connect } from 'react-redux';

class FilterFooter extends Component {
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
        history.push('?' + '');
        filterClear();
    };

    handleApplyFilters = () => {
        const { history, chosenFilterOptions, closeModalHandler } = this.props;
        history.push('?' + serialize(chosenFilterOptions));
        closeModalHandler();
    };

    getFooterButtons = areOptionsPristine => {
        const { classes } = this.props;
        return (
            <Fragment>
                <button
                    onClick={this.resetFilterOptions}
                    disabled={areOptionsPristine}
                    className={
                        areOptionsPristine
                            ? classes.resetButtonDisabled
                            : classes.resetButton
                    }
                >
                    Reset Filters
                </button>
                <button
                    onClick={this.handleApplyFilters}
                    disabled={areOptionsPristine}
                    className={
                        areOptionsPristine
                            ? classes.applyButtonDisabled
                            : classes.applyButton
                    }
                >
                    Apply Filters
                </button>
            </Fragment>
        );
    };

    render() {
        const { areOptionsPristine } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.footer}>
                {areOptionsPristine}
                {this.getFooterButtons(areOptionsPristine)}
            </div>
        );
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
