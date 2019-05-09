import React, { Fragment } from 'react';
import TextInput from 'src/components/TextInput';
import Trigger from 'src/components/Trigger';
import { Form } from 'informed';
import Icon from 'src/components/Icon';
import ClearIcon from 'react-feather/dist/icons/x';
import SearchIcon from 'react-feather/dist/icons/search';
import classify from 'src/classify';
import defaultClasses from './filterSearch.css';

const clearIcon = <Icon src={ClearIcon} size={18} />;
const searchIcon = <Icon src={SearchIcon} size={18} />;

const withFilterSearch = WrappedComponent => {
    class withFilterSearch extends React.Component {
        state = {
            filterQuery: ''
        };

        handleFilterSearch = value => this.setState({ filterQuery: value });

        getFilteredItems = (items, filterQuery) =>
            items.filter(item =>
                item.label.toUpperCase().includes(filterQuery.toUpperCase())
            );

        getSearchInput = ({ formApi }) => {
            const { handleFilterSearch } = this;
            const handleResetSearch = () => formApi.reset();
            const { name } = this.props;
            const { filterQuery } = this.state;

            const resetButton = filterQuery && (
                <Trigger action={handleResetSearch}>{clearIcon}</Trigger>
            );

            return (
                <TextInput
                    placeholder={`Search for a specific ${name}`}
                    onValueChange={handleFilterSearch}
                    field="filter_search"
                    after={resetButton}
                    before={searchIcon}
                />
            );
        };

        render() {
            const { getFilteredItems, getSearchInput } = this;
            const { filterQuery } = this.state;
            const { items, classes, options, ...rest } = this.props;

            const isSearchable = options && options.searchable;

            const filteredItems =
                isSearchable && filterQuery
                    ? getFilteredItems(items, filterQuery)
                    : items;

            return (
                <Fragment>
                    {isSearchable && (
                        <Form className={classes.filterSearch}>
                            {getSearchInput}
                        </Form>
                    )}
                    {filteredItems.length > 0 ? (
                        <WrappedComponent
                            {...rest}
                            classes={classes}
                            options={options}
                            items={filteredItems}
                        />
                    ) : (
                        <div className={classes.noFilters}>
                            No filter matches the search
                        </div>
                    )}
                </Fragment>
            );
        }
    }

    return classify(defaultClasses)(withFilterSearch);
};

export default withFilterSearch;
