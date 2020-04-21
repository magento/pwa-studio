import React from 'react';
import { act } from 'react-test-renderer';
import createTestInstance from '../../util/createTestInstance';
import { useSort } from '../useSort';

const log = jest.fn();

const TestComponent = (props = {}) => {
    const hookOutput = useSort(props.props);

    // use a spies pattern to get the hook input and output
    log(hookOutput);

    // render empty react element to get a working react compontent
    return <i />;
};

test('should render without an error', () => {
    createTestInstance(<TestComponent />);
    const result = log.mock.calls[0][0];

    expect(result.sortText).toBe('Best Match');
});

test('should render with a differnt sort order', () => {
    const sortOrder = {
        sortAttribute: 'price',
        sortDirection: 'ASC'
    };

    createTestInstance(<TestComponent props={sortOrder} />);
    const result = log.mock.calls[0][0];

    expect(result.sortText).toBe('Price: Low to High');
});

test('should render with updated sort order', () => {
    createTestInstance(<TestComponent />);
    const result = log.mock.calls[0][0];

    expect(result.sortText).toBe('Best Match');

    act(() => {
        result.api.sortControl.setSort({
            sortAttribute: 'price',
            sortDirection: 'ASC'
        });
    });

    const result2 = log.mock.calls[1][0];
    expect(result2.sortText).toBe('Price: Low to High');
});
