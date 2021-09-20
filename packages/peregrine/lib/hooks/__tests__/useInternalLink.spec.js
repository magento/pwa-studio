import { useAppContext } from '../../context/app';
import useInternalLink, { SHIMMER_TYPE_SUFFIX } from '../useInternalLink';

jest.mock('../../context/app', () => ({
    useAppContext: jest.fn()
}));

jest.mock('react', () => ({
    useCallback: jest.fn(fn => fn)
}));

const mockSetNextRootComponent = jest.fn();

beforeEach(() => {
    mockSetNextRootComponent.mockClear();
    useAppContext.mockImplementation(() => [
        null,
        {
            actions: {
                setNextRootComponent: mockSetNextRootComponent
            }
        }
    ]);
});

afterEach(() => {
    globalThis.avoidDelayedTransition = false;
});

describe('#useInternalLink setShimmerType', () => {
    test('calls setNextRootComponent', () => {
        const { setShimmerType } = useInternalLink('test_type');
        setShimmerType();

        expect(mockSetNextRootComponent).toHaveBeenCalledWith(
            `TEST_TYPE${SHIMMER_TYPE_SUFFIX}`
        );
    });

    test('sets global transition flag', () => {
        const { setShimmerType } = useInternalLink('TEST_TYPE');
        setShimmerType();

        expect(globalThis.avoidDelayedTransition).toBe(true);
    });
});
