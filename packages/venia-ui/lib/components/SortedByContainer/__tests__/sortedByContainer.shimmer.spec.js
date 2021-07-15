import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { mockShimmer } from '../../Shimmer';
import ShimmerComponent from '../sortedByContainer.shimmer';


const mockClassName = 'root';
const mockClasses = {
    [mockClassName]: 'test-class'
};

jest.mock('../../Shimmer', () => {
    const mockedShimmer = jest.fn(() => null);

    return {
        __esModule: true,
        default: mockedShimmer,
        mockShimmer: mockedShimmer
    }
});

jest.mock('../../../classify', () => ({
    mergeClasses: (...objects) => Object.assign({}, ...objects)
}));

let passedProps = {};

const givenDefaultProps = () => {
    passedProps = {};
};

const givenPassedClasses = () => {
    passedProps = {
        classes: mockClasses
    };
};

describe('#sortedByContainer Shimmer', () => {
    beforeEach(() => {
        mockShimmer.mockClear();

        givenDefaultProps();
    });

    test('renders Shimmer component', () => {
        const instance = createTestInstance(<ShimmerComponent {...passedProps} />);

        expect(mockShimmer).toHaveBeenCalled();
    });

    test('passes merged class to Shimmer component', () => {
        givenPassedClasses();
        const instance = createTestInstance(<ShimmerComponent {...passedProps} />);


        expect(mockShimmer).toHaveBeenCalledWith(
            expect.objectContaining({
                className: mockClasses[mockClassName]
            }),
            expect.any(Object)
        );
    });
});
