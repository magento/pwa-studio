import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useFilterList } from '../useFilterList';

const log = jest.fn();

let handleClickProp = null;
let inputValues = {};

const Component = () => {
    const talonProps = useFilterList(inputValues);

    useEffect(() => {
        log(talonProps);
        handleClickProp = talonProps.handleListToggle;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        filterState: new Set(),
        items: [],
        itemCountToShow: 2
    };
};

const givenSelectedItems = () => {
    const items = [
        {
            attribute_code: 'item1'
        },
        {
            attribute_code: 'item2'
        },
        {
            attribute_code: 'item3'
        }
    ];

    inputValues = {
        ...inputValues,
        filterState: new Set().add(items[2]),
        items: items
    };
};

describe('#useFilterList', () => {
    beforeEach(() => {
        log.mockClear();
        handleClickProp = null;
        givenDefaultValues();
    });

    it('is initially closed', () => {
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            handleListToggle: expect.any(Function),
            isListExpanded: false
        });
    });

    it('is initially opened', () => {
        givenSelectedItems();
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            handleListToggle: expect.any(Function),
            isListExpanded: true
        });
    });

    it('can toggle visibility', () => {
        createTestInstance(<Component />);

        expect(typeof handleClickProp).toBe('function');

        act(() => {
            handleClickProp();
        });

        expect(log).toHaveBeenLastCalledWith({
            handleListToggle: expect.any(Function),
            isListExpanded: true
        });
    });
});
