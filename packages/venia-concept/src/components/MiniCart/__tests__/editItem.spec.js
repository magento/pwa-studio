import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditItem from '../editItem';

jest.mock('../cartOptions');
jest.mock('src/components/LoadingIndicator', () => {
    return {
        __esModule: true,
        loadingIndicator: '( Loading Indicator Component Here )'
    };
});

test('renders null when item not supplied', () => {
    const tree = createTestInstance(
        <EditItem />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders cart options when item has no options', () => {
    const props = {
        item: {
            options: []
        }
    };

    const tree = createTestInstance(
        <EditItem {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('renders a loading indicator while running query', () => {
    const props = {
        item: {
            options: ['a', 'b', 'c']
        }
    };

    const tree = createTestInstance(
        <EditItem {...props} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

// TODO: 'renders cart options when item has options'.
// Was unsure how to trigger / mock this scenario in tests.
