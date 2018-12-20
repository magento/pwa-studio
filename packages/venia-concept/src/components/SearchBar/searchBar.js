import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import getQueryParameterValue from '../../util/getQueryParameterValue';
import { SEARCH_QUERY_PARAMETER } from '../../RootComponents/Search/consts';
import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import TextInput from 'src/components/TextInput';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

const initialValues = {
    search_query: ''
};

// TODO: remove export here (update story and test)
export class SearchBar extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            clearIcon: PropTypes.string,
            clearIcon_off: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchBlock_open: PropTypes.string,
            searchBar: PropTypes.string,
            searchIcon: PropTypes.string
        }),
        executeSearch: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        isOpen: PropTypes.bool
    };

    state = {
        dirty: false
    };

    componentDidMount() {
        const searchValueFromQueryString = getQueryParameterValue({
            location: this.props.location,
            queryParameter: SEARCH_QUERY_PARAMETER
        });

        this.formApi.setValue('search_query', searchValueFromQueryString);
    }

    get resetButton() {
        const { props, resetForm, state } = this;
        const { classes } = props;

        return state.dirty ? (
            <Button className={classes.clearIcon} onClick={resetForm}>
                <Icon name="x" />
            </Button>
        ) : null;
    }

    handleChange = ({ values }) => {
        const dirty = !!values.search_query;
        this.setState({ dirty });
    };

    handleSubmit = ({ search_query }) => {
        this.props.executeSearch(search_query, this.props.history);
    };

    resetForm = () => {
        this.formApi.reset();
    };

    setApi = formApi => {
        this.formApi = formApi;
    };

    render() {
        const { classes, isOpen } = this.props;

        const searchClass = isOpen
            ? classes.searchBlock_open
            : classes.searchBlock;

        return (
            <Form
                getApi={this.setApi}
                initialValues={initialValues}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
            >
                <div className={searchClass}>
                    <Icon name="search" />
                    <TextInput id={classes.searchBar} field="search_query" />
                    {this.resetButton}
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(SearchBar);
