import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useAttributeType } from '../useAttributeType';

const mockType = 'type';

let getAttributeTypeConfigProp = null;
let inputValues = {};

const Component = () => {
    const talonProps = useAttributeType(inputValues);

    useEffect(() => {
        getAttributeTypeConfigProp = talonProps.getAttributeTypeConfig;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {};
};

const givenConfig = () => {
    inputValues = {
        typeConfig: {
            type: {
                component: <mock-Component />
            }
        }
    };
};

describe('#useAttributeType', () => {
    beforeEach(() => {
        getAttributeTypeConfigProp = null;
        givenDefaultValues();
    });

    it('returns undefined if config not provided', () => {
        createTestInstance(<Component />);

        expect(typeof getAttributeTypeConfigProp).toBe('function');

        act(() => {
            const config = getAttributeTypeConfigProp(mockType);

            expect(config).toMatchInlineSnapshot(`undefined`);
        });
    });

    it('returns undefined if type is not found in config', () => {
        givenConfig();
        createTestInstance(<Component />);

        expect(typeof getAttributeTypeConfigProp).toBe('function');

        act(() => {
            const config = getAttributeTypeConfigProp('faketype');

            expect(config).toMatchInlineSnapshot(`undefined`);
        });
    });

    it('returns data if type is found in config', () => {
        givenConfig();
        createTestInstance(<Component />);

        expect(typeof getAttributeTypeConfigProp).toBe('function');

        act(() => {
            const config = getAttributeTypeConfigProp(mockType);

            expect(config).toMatchInlineSnapshot(`
                Object {
                  "component": <mock-Component />,
                }
            `);
        });
    });
});
