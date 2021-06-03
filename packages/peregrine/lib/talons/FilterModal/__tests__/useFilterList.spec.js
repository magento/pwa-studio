import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useFilterList } from '../useFilterList';

const log = jest.fn();

let handleClickProp = null;

const Component = () => {
    const talonProps = useFilterList();

    useEffect(() => {
        log(talonProps);
        handleClickProp = talonProps.handleListToggle;
    }, [talonProps]);

    return null;
};

describe('#useFilterList', () => {
    beforeEach(() => {
        log.mockClear();
        handleClickProp = null;
    });

    it('is initially closed', () => {
        createTestInstance(<Component />);

        expect(log).toHaveBeenCalledWith({
            handleListToggle: expect.any(Function),
            isListExpanded: false
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
