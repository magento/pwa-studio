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

        handleResetSearch = () => this.setState({ filterQuery: '' });

        getFilteredItems = (items, filterQuery) =>
            items.filter(item =>
                item.label.toUpperCase().includes(filterQuery.toUpperCase())
            );

        render() {
            const {
                handleFilterSearch,
                getFilteredItems,
                handleResetSearch
            } = this;
            const { filterQuery } = this.state;
            const { items, classes, options, name, ...rest } = this.props;

            const isSearchable = options && options.searchable;

            const filteredItems = isSearchable
                ? getFilteredItems(items, filterQuery)
                : items;

            const resetButton = filterQuery && (
                <Trigger action={handleResetSearch}>{clearIcon}</Trigger>
            );

            return (
                <Fragment>
                    {isSearchable && (
                        <Form className={classes.filterSearch}>
                            <TextInput
                                placeholder={`Search for a specific ${name}`}
                                onValueChange={handleFilterSearch}
                                field="filter_search"
                                after={resetButton}
                                before={searchIcon}
                            />
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
