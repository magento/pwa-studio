import React from 'react';
import { act, create } from 'react-test-renderer';
import { Link as RouterLink } from 'react-router-dom';
import { useLink } from '@magento/peregrine/lib/talons/Link/useLink';
import Link from '../link';

jest.mock('@magento/peregrine/lib/talons/Link/useLink', () => {
    return {
        useLink: jest.fn(({ innerRef }) => {
            return {
                ref: innerRef
            };
        })
    };
});

jest.mock('react-router-dom', () => {
    return {
        Link: jest.fn(() => {
            return '<div id="original-link"></div>';
        })
    };
});

beforeEach(() => {
    useLink.mockClear();
});

describe('#Link', () => {
    test('passes data to talon', async () => {
        await act(() => {
            create(<Link prefetchType innerRef="foo" />);
        });

        expect(useLink).toHaveBeenCalledWith(
            expect.objectContaining({
                prefetchType: true,
                innerRef: 'foo'
            })
        );
    });

    test('passes props to base link component', async () => {
        await act(() => {
            create(<Link foo="bar" />);
        });

        expect(RouterLink).toHaveBeenCalledWith(
            expect.objectContaining({
                foo: 'bar'
            }),
            {}
        );
    });
});
