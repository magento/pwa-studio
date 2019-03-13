import React, { Component } from 'react';
import { Form } from 'informed';
import { bool, func, object, shape, string } from 'prop-types';
import getQueryParameterValue from '../../util/getQueryParameterValue';
import { SEARCH_QUERY_PARAMETER } from '../../RootComponents/Search/consts';
import SearchAutocomplete from './autocomplete';
import Icon from 'src/components/Icon';
import ClearIcon from 'react-feather/dist/icons/x';
import SearchIcon from 'react-feather/dist/icons/search';
import TextInput from 'src/components/TextInput';
import Trigger from 'src/components/Trigger';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

const initialValues = {
    search_query: ''
};

const clearIcon = <Icon src={ClearIcon} size={18} />;
const searchIcon = <Icon src={SearchIcon} size={18} />;

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
            dirty: false,
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

        return state.dirty && <Trigger action={resetForm}>{clearIcon}</Trigger>;
    }

    updateAutocompleteVisible = visible => {
        this.setState({
            autocompleteVisible: visible
        });
    };

    handleChange = ({ values }) => {
        const dirty = !!values.search_query;
        dirty !== this.state.dirty && this.setState({ dirty });
    };

    handleInputChange = () => this.updateAutocompleteVisible(true);

    handleSubmit = ({ search_query }) => {
        if (search_query) {
            this.props.executeSearch(search_query, this.props.history);
            this.updateAutocompleteVisible(false);
        }
    };

    resetForm = () => {
        this.updateAutocompleteVisible(false);
        this.formApi.reset();
    };

    setApi = formApi => {
        this.formApi = formApi;
    };

    render() {
        const { props, resetButton, formApi } = this;
        const { autocompleteVisible } = this.state;
        const { classes, isOpen } = props;
        const className = isOpen ? classes.root_open : classes.root;

        const { values } = (formApi && formApi.getState()) || {};
        const searchQuery = (values && values.search_query) || '';

        return (
            <div className={className}>
                <div className={classes.searchInner} ref={this.searchRef}>
                    <Form
                        className={classes.form}
                        getApi={this.setApi}
                        autoComplete="off"
                        initialValues={initialValues}
                        onChange={this.handleChange}
                        onSubmit={this.handleSubmit}
                    >
                        <TextInput
                            field="search_query"
                            onFocus={this.inputFocus}
                            onChange={this.handleInputChange}
                            after={resetButton}
                            before={searchIcon}
                        />

                        <div
                            className={classes.SearchAutocompleteWrapper}
                            ref={this.autocompleteRef}
                        >
                            <SearchAutocomplete
                                searchQuery={searchQuery}
                                updateAutocompleteVisible={
                                    this.updateAutocompleteVisible
                                }
                                autocompleteVisible={autocompleteVisible}
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
