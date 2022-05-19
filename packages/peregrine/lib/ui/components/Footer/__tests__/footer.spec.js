import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';

import Footer from '../footer';

jest.mock('../../../classify');

jest.mock('@magento/peregrine/lib/talons/Footer/useFooter', () => {
    const talonProps = { copyrightText: 'foo' };
    const useFooter = jest.fn(() => talonProps);

    return { useFooter };
});

jest.mock('@magento/venia-ui/lib/components/Logo', () => {
    return props => <i {...props} />;
});

jest.mock('@magento/venia-ui/lib/components/Newsletter', () => {
    return props => <i {...props} />;
});

const mockLinkComponent = ({ children }) => {
    return children;
};

const links = new Map()
    .set('ab', [
        ['a', '/a'],
        ['b', '/b'],
        ['comp', { path: '/comp', Component: mockLinkComponent }]
    ])
    .set('12', [['1', '/1'], ['2', '/2']]);

test('footer renders copyright', () => {
    const instance = createTestInstance(
        <MemoryRouter>
            <Footer links={links} />
        </MemoryRouter>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
