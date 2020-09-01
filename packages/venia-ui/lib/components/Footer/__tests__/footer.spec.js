import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';

import Footer from '../footer';
import { IntlProvider } from 'react-intl';

jest.mock('../../../classify');

jest.mock('@apollo/client', () => {
    const queryResult = {
        loading: false,
        error: null,
        data: null
    };
    const useQuery = jest.fn(() => {
        queryResult;
    });

    return { useQuery };
});

jest.mock('@magento/peregrine/lib/talons/Footer/useFooter', () => {
    const talonProps = { copyrightText: 'foo' };
    const useFooter = jest.fn(() => talonProps);

    return { useFooter };
});

jest.mock('@magento/venia-ui/lib/components/Logo', () => {
    return props => <i {...props} />;
});

const links = new Map()
    .set('ab', [['a', '/a'], ['b', '/b']])
    .set('12', [['1', '/1'], ['2', '/2']]);

test('footer renders copyright', () => {
    const instance = createTestInstance(
        <MemoryRouter>
            <IntlProvider locale="en-US">
                <Footer links={links} />
            </IntlProvider>
        </MemoryRouter>
    );

    expect(instance.toJSON()).toMatchSnapshot();
    expect(true).toBe(true);
});
