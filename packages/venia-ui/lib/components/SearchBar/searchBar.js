import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useIntl } from 'react-intl';
import { useSearchBar } from '@magento/peregrine/lib/talons/SearchBar';

import { useStyle } from '../../classify';
import Autocomplete from './autocomplete';
import SearchField from './searchField';
import defaultClasses from './searchBar.module.css';

const SearchBar = React.forwardRef((props, ref) => {
    const { isOpen } = props;
    const talonProps = useSearchBar();
    const {
        containerRef,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        isAutoCompleteOpen,
        setIsAutoCompleteOpen,
        valid
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const { formatMessage } = useIntl();
    return (
        <div className={rootClassName} data-cy="SearchBar-root" ref={ref}>
            <div ref={containerRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.search}>
                        <SearchField
                            addLabel={formatMessage({
                                id: 'global.clearText',
                                defaultMessage: 'Clear Text'
                            })}
                            isSearchOpen={isOpen}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <div className={classes.autocomplete}>
                            <Autocomplete
                                setVisible={setIsAutoCompleteOpen}
                                valid={valid}
                                visible={isAutoCompleteOpen}
                            />
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
});

export default SearchBar;

SearchBar.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    isOpen: bool
};
