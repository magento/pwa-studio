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
    const [{ sortText }] = result;
    expect(sortText).toBe('Best Match');
});

test('should render with a different sort order', () => {
    const sortOrder = {
        sortText: 'Price: Low to High',
        sortAttribute: 'price',
        sortDirection: 'ASC'
    };

    createTestInstance(<TestComponent props={sortOrder} />);
    const result = log.mock.calls[0][0];
    const [{ sortText }] = result;
    expect(sortText).toBe('Price: Low to High');
});

test('should render with updated sort order', () => {
    createTestInstance(<TestComponent />);
    const result = log.mock.calls[0][0];
    const [{ sortText }, setSort] = result;
    expect(sortText).toBe('Best Match');

    act(() => {
        setSort({
            sortText: 'Price: Low to High',
            sortAttribute: 'price',
            sortDirection: 'ASC'
        });
    });

    const nextResult = log.mock.calls[1][0];
    const [{ sortText: nextSortText }] = nextResult;
    expect(nextSortText).toBe('Price: Low to High');
});
