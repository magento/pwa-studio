import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useFilterBlock } from '../useFilterBlock';

const log = jest.fn();

let handleClickProp = null;
let inputValues = {};

const Component = () => {
    const talonProps = useFilterBlock(inputValues);

    useEffect(() => {
        log(talonProps);
        handleClickProp = talonProps.handleClick;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        filterState: new Set(),
        items: [],
        initialOpen: false
    };
};

const givenInitiallyOpen = () => {
    inputValues = {
        filterState: new Set(),
        items: [],
        initialOpen: true
    };
};

const givenSelectedItems = () => {
    const item = {
        attribute_code: 'foo'
    };

    inputValues = {
        filterState: new Set().add(item),
        items: [item],
        initialOpen: false
    };
};

describe('#useFilterBlock', () => {
    beforeEach(() => {
        log.mockClear();
        handleClickProp = null;
        givenDefaultValues();
    });

    it('is closed by default', () => {
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            handleClick: expect.any(Function),
            isExpanded: false
        });
    });

    it('is open if passed initially open', () => {
        givenInitiallyOpen();
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            handleClick: expect.any(Function),
            isExpanded: true
        });
    });

    it('is open if items are selected', () => {
        givenSelectedItems();
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            handleClick: expect.any(Function),
            isExpanded: true
        });
    });

    it('can toggle visibility', () => {
        createTestInstance(<Component />);

        expect(typeof handleClickProp).toBe('function');

        act(() => {
            handleClickProp();
        });

        expect(log).toHaveBeenLastCalledWith({
            handleClick: expect.any(Function),
            isExpanded: true
        });
    });
});
