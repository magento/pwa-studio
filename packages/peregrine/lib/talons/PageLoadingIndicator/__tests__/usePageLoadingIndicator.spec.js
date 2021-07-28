import { useAppContext } from '../../../context/app';
import usePageLoadingIndicator from '../usePageLoadingIndicator';

jest.mock('../../../context/app', () => {
    return {
        useAppContext: jest.fn()
    };
});

const givenPageLoadingValue = () => {
    useAppContext.mockImplementation(() => [{
        isPageLoading: 'foo'
    }]);
}

beforeEach(() => {
    useAppContext.mockClear();
});

describe('#usePageLoadingIndicator', () => {
    test('returns isPageLoading value from app context', () => {
        givenPageLoadingValue();
        const result = usePageLoadingIndicator();

        expect(result).toEqual(expect.objectContaining({
            isPageLoading: 'foo'
        }));
    });
});
