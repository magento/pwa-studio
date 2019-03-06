import React from 'react';
import testRenderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import SearchAutocomplete from '../autocomplete';
import waitForExpect from 'wait-for-expect';

jest.mock('src/classify');

jest.mock('lodash/debounce', debounceTimer =>
    jest.fn(fn => setTimeout(() => fn, debounceTimer))
);

jest.mock('src/components/LoadingIndicator', () => ({
    loadingIndicator: 'Fetching Data...'
}));

jest.mock('../suggestedCategories');
jest.mock('../suggestedProducts');

let mockLoading, mockError, mockData;

jest.mock('src/drivers', () => ({
    Query: ({ children }) => {
        return children({
            loading: mockLoading,
            error: mockError,
            data: mockData
        });
    }
}));

beforeEach(() => {
    mockLoading = false;
    mockError = false;
    mockData = {};
});

test('Autocomplete query update should be debounced', async () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'test';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={true}
            updateAutocompleteVisible={updateAutocompleteVisible}
            executeSearch={jest.fn()}
        />
    ).dive();

    /* Expect component to initialize with empty string */
    expect(wrapper.instance().state.autocompleteQuery).toEqual(initialState);

    wrapper.setProps({ searchQuery: testString });

    /* Expect component not to update right away (debounce) */
    expect(wrapper.instance().state.autocompleteQuery).toEqual(initialState);

    await waitForExpect(() => {
        expect(wrapper.instance().state.autocompleteQuery).toEqual(testString);
    });
});

test('Autocomplete should not render if autocompleteVisible is set to false', async () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'test';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={false}
            updateAutocompleteVisible={updateAutocompleteVisible}
            executeSearch={jest.fn()}
        />
    ).dive();

    wrapper.setProps({ searchQuery: testString });

    await waitForExpect(() => {
        expect(wrapper.instance().render()).toBeNull();
    });
});

test('Autocomplete should not render if searchQuery is null or less than 3 chars long', async () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'ab';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={true}
            updateAutocompleteVisible={updateAutocompleteVisible}
            executeSearch={jest.fn()}
        />
    ).dive();
    /* Expect component to return null if search query is null" */
    expect(wrapper.instance().render()).toBeNull();

    wrapper.setProps({ searchQuery: testString });

    await waitForExpect(() => {
        expect(wrapper.instance().render()).toBeNull();
    });
});

test('Autocomplete should render if searchQuery and autocompleteVisible props result in true', async () => {
    const updateAutocompleteVisible = jest
        .fn()
        .mockImplementationOnce(() => {});
    const initialState = '';
    const testString = 'test';

    const wrapper = shallow(
        <SearchAutocomplete
            searchQuery={initialState}
            autocompleteVisible={true}
            updateAutocompleteVisible={updateAutocompleteVisible}
            executeSearch={jest.fn()}
        />
    ).dive();

    wrapper.setProps({ searchQuery: testString });

    await waitForExpect(() => {
        expect(wrapper.instance().render()).not.toBeNull();
    });
});

test('renders error', async () => {
    mockError = true;
    const props = {
        searchQuery: 'i display an error',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };

    const component = testRenderer.create(<SearchAutocomplete {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders loading indicator', async () => {
    mockLoading = true;
    const props = {
        searchQuery: 'i display a loading indicator',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };

    const component = testRenderer.create(<SearchAutocomplete {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders no results', async () => {
    mockData = {
        products: {
            items: []
        }
    };
    const props = {
        searchQuery: 'i display no results',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };

    const component = testRenderer.create(<SearchAutocomplete {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders SuggestedCategories and SuggestedProducts', () => {
    const mockItem = {
        id: 1,
        name: 'pants'
    };
    const mockFilter = {
        name: 'Category',
        filter_items: [
            {
                label: 'foo',
                value_string: '123'
            }
        ]
    };
    mockData = {
        products: {
            items: [mockItem],
            filters: [mockFilter]
        }
    };
    const props = {
        searchQuery: 'i display no results',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };

    const component = testRenderer.create(<SearchAutocomplete {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls updateAutocompleteVisible prop fn with false on product open', () => {
    const props = {
        searchQuery: '',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };

    const component = testRenderer.create(<SearchAutocomplete {...props} />);

    component.root.children[0].instance.handleOnProductOpen();
    expect(props.updateAutocompleteVisible).toHaveBeenCalledWith(false);
});

test('calls updateAutocompleteVisible prop fn with false and', () => {
    const props = {
        searchQuery: '',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };
    const id = 1;
    const component = testRenderer.create(<SearchAutocomplete {...props} />);

    component.root.children[0].instance.handleCategorySearch({
        preventDefault: jest.fn(),
        currentTarget: { dataset: { id } }
    });

    expect(props.updateAutocompleteVisible).toHaveBeenCalledWith(false);
    expect(props.executeSearch).toHaveBeenCalledWith(
        props.searchQuery,
        undefined,
        id
    );

    props.updateAutocompleteVisible.mockReset();
    props.executeSearch.mockReset();

    // Test for when currenttarget has no dataset attrs
    component.root.children[0].instance.handleCategorySearch({
        preventDefault: jest.fn(),
        currentTarget: {},
        srcElement: { dataset: { id } }
    });

    expect(props.updateAutocompleteVisible).toHaveBeenCalledWith(false);
    expect(props.executeSearch).toHaveBeenCalledWith(
        props.searchQuery,
        undefined,
        id
    );
});

test('updateAutocompleteQuery updates state', async () => {
    const props = {
        searchQuery: '',
        autocompleteVisible: true,
        updateAutocompleteVisible: jest.fn(),
        executeSearch: jest.fn()
    };

    const component = testRenderer.create(<SearchAutocomplete {...props} />);
    component.root.children[0].instance.setState = jest.fn();
    component.root.children[0].instance.updateAutocompleteQuery('foo');

    await waitForExpect(() => {
        expect(
            component.root.children[0].instance.setState
        ).toHaveBeenCalledWith({
            autocompleteQuery: 'foo',
            isQueryUpdating: false
        });
    });
});
