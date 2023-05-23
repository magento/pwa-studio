import React from 'react';
import { useStyle } from '../../../classify';
import defaultClasses from './Search.module.css';
import { useStoreLocatorContext } from '../StoreLocatorProvider/StoreLocatorProvider';
import { useIntl } from 'react-intl';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const Search = props => {
    const { searchValue, setSearchValue, setCenterCoordinates, setMapZoom } = useStoreLocatorContext();
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const {
        ready,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSearchChange = e => {
        setSearchValue(e.target.value);
        setValue(e.target.value);
    };
    const placeholderText = formatMessage({
        id: 'storeLocator.searchForLocation',
        defaultMessage: 'Search for location'
    });

    const handleSuggestionSelect = async address => {
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setCenterCoordinates({ lat: lat, lng: lng });
            setMapZoom(8);
        } catch (error) {
            console.log('error', error);
        }
    };

    return (
        <div className={classes.searchContainer}>
            <input
                value={searchValue}
                onChange={handleSearchChange}
                disabled={!ready}
                placeholder={placeholderText}
                className={classes.searchInput}
            />
            {status === 'OK' && (
                <ul className={classes.suggestionsList}>
                    {data.map(suggestion => (
                        <li
                            key={suggestion.id}
                            onClick={() => handleSuggestionSelect(suggestion.description)}
                            className={classes.suggestionItem}
                        >
                            {suggestion.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;
