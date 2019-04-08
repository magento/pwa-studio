import React from 'react';
import waitForExpect from 'wait-for-expect';
import { MockedProvider } from 'react-apollo/test-utils';
import TestRenderer from 'react-test-renderer';

import Footer from '../footer';
import storeConfigDataQuery from 'src/queries/getStoreConfigData.graphql';

test('footer renders copyright', () => {
    const mocks = [
        {
            request: {
                query: storeConfigDataQuery
            },
            result: {
                data: {
                    storeConfig: {
                        id: 1,
                        copyright: 'Mocked Copyright Text'
                    }
                }
            }
        }
    ];

    const classes = {
        copyright: 'copyright-class',
        root: 'root-class',
        tile: 'title-class',
        tileBody: 'tileBody-class',
        tileTitle: 'tileTitle-class'
    };

    const { root } = TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
            <Footer classes={classes} />
        </MockedProvider>
    );

    const copyright = root.findByProps({ className: classes.copyright });

    waitForExpect(() => {
        expect(copyright.toString()).toEqual(
            '<span>Mocked Copyright Text</span>'
        );
    });
});
