import React, { Component } from 'react';
import { Form } from 'informed';
import { bool, func, object, shape, string } from 'prop-types';
import getQueryParameterValue from '../../util/getQueryParameterValue';
import { SEARCH_QUERY_PARAMETER } from '../../RootComponents/Search/consts';
import SearchAutocomplete from './autocomplete';
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
            clearIcon: string,
            clearIcon_off: string,
            root: string,
            searchBlock: string,
            searchBlockOpen: string,
            searchBar: string,
            searchIcon: string
        }),
        executeSearch: func.isRequired,
        history: object,
        isOpen: bool,
        location: object,
        match: object
    };

    constructor(props) {
        super(props);
        this.searchRef = React.createRef();
        this.autocompleteRef = React.createRef();
        this.state = {
            searchQuery: '',
            autocompleteVisible: false
        };
    }

    componentWillUnmount = () => {
        document.removeEventListener(
            'mousedown',
            this.autocompleteClick,
            false
        );
    };

    componentDidMount() {
        const searchValueFromQueryString = getQueryParameterValue({
            location: this.props.location,
            queryParameter: SEARCH_QUERY_PARAMETER
        });

        document.addEventListener('mousedown', this.autocompleteClick, false);
        this.setState({
            searchQuery: searchValueFromQueryString
        });
        this.formApi.setValue('search_query', searchValueFromQueryString);
    }

    autocompleteClick = e => {
        if (
            this.searchRef.current.contains(e.target) ||
            this.autocompleteRef.current.contains(e.target)
        )
            return;
        this.updateAutocompleteVisible(false);
    };

    inputFocus = () => {
        this.updateAutocompleteVisible(true);
    };

    get resetButton() {
        const { resetForm, state } = this;

        return state.searchQuery ? (
            <Trigger action={resetForm}>{clearIcon}</Trigger>
        ) : null;
    }

    updateAutocompleteVisible = visible => {
        this.setState({
            autocompleteVisible: visible
        });
    };

    setSearchQuery = value => this.setState({ searchQuery: value });

    handleChange = event => {
        const { value } = event.currentTarget || event.srcElement;
        this.updateAutocompleteVisible(true);
        this.setSearchQuery(value);
    };

    handleSubmit = () => {
        const { searchQuery } = this.state;
        this.updateAutocompleteVisible(false);
        if (searchQuery !== '') {
            this.props.executeSearch(searchQuery, this.props.history);
        }
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
                <div className={classes.searchInner} ref={this.searchRef}>
                    <Form
                        className={classes.form}
                        getApi={this.setApi}
                        autoComplete="off"
                        initialValues={initialValues}
                        onSubmit={this.handleSubmit}
                    >
                        <TextInput
                            field="search_query"
                            onFocus={this.inputFocus}
                            onChange={this.handleChange}
                            after={resetButton}
                            before={searchIcon}
                        />

                        <div
                            className={classes.SearchAutocompleteWrapper}
                            ref={this.autocompleteRef}
                        >
                            <SearchAutocomplete
                                searchQuery={this.state.searchQuery}
                                updateAutocompleteVisible={
                                    this.updateAutocompleteVisible
                                }
                                autocompleteVisible={
                                    this.state.autocompleteVisible
                                }
                                executeSearch={this.props.executeSearch}
                                history={this.props.history}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(SearchBar);
