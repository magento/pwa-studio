import React from 'react';
import waitForExpect from 'wait-for-expect';
import TestRenderer from 'react-test-renderer';
import { useQuery } from '@apollo/react-hooks';

import Footer from '../footer';

jest.mock('@apollo/react-hooks', () => {
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

test('footer renders copyright', () => {
    const queryResult = {
        data: {
            storeConfig: {
                id: 1,
                copyright: 'Mocked Copyright Text'
            }
        }
    };
    useQuery.mockImplementationOnce(() => queryResult);

    const classes = {
        copyright: 'copyright-class'
    };

    const { root } = TestRenderer.create(<Footer classes={classes} />);

    const copyright = root.findByProps({ className: classes.copyright });

    waitForExpect(() => {
        expect(copyright.toString()).toEqual(
            '<span>Mocked Copyright Text</span>'
        );
    });
});
