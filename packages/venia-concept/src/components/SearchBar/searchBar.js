import React, { Component } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { Form } from 'informed';

import getQueryParameterValue from '../../util/getQueryParameterValue';
import { SEARCH_QUERY_PARAMETER } from '../../RootComponents/Search/consts';
import Icon from 'src/components/Icon';
import TextInput from 'src/components/TextInput';
import Trigger from 'src/components/Trigger';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

const initialValues = {
    search_query: ''
};

const clearIcon = <Icon name="x" attrs={{ height: 18, width: 18 }} />;
const searchIcon = <Icon name="search" attrs={{ height: 18, width: 18 }} />;

// TODO: remove export here (update story and test)
export class SearchBar extends Component {
    static propTypes = {
        classes: shape({
            form: string,
            root: string,
            root_open: string
        }),
        executeSearch: func.isRequired,
        history: object.isRequired,
        location: object.isRequired,
        isOpen: bool
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
        const { resetForm, state } = this;

        return state.dirty ? (
            <Trigger action={resetForm}>{clearIcon}</Trigger>
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
        const { props, resetButton } = this;
        const { classes, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;

        return (
            <div className={className}>
                <Form
                    className={classes.form}
                    getApi={this.setApi}
                    initialValues={initialValues}
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                >
                    <TextInput
                        field="search_query"
                        after={resetButton}
                        before={searchIcon}
                    />
                </Form>
            </div>
        );
    }
}

export default classify(defaultClasses)(SearchBar);
