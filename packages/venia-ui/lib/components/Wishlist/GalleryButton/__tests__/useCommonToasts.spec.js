import { renderHook } from '@testing-library/react-hooks';
import { useCommonToasts } from '../useCommonToasts';
import { useToasts } from '@magento/peregrine';

jest.mock('@magento/peregrine', () => ({
    useToasts: jest.fn().mockReturnValue([{}, { addToast: jest.fn() }])
}));

test('renders nothing', () => {
    const [, { addToast: mockAddToast }] = useToasts();

    renderHook(useCommonToasts);

    expect(mockAddToast).not.toHaveBeenCalled();
});

test('renders error toast', () => {
    const [, { addToast: mockAddToast }] = useToasts();

    renderHook(useCommonToasts, {
        initialProps: {
            errorToastProps: { message: 'Oh noes! Something went wrong.' }
        }
    });

    expect(mockAddToast.mock.calls[0][0]).toMatchSnapshot();
});

test('renders login toast', () => {
    const [, { addToast: mockAddToast }] = useToasts();

    renderHook(useCommonToasts, {
        initialProps: {
            loginToastProps: { message: 'You must login to proceed!' }
        }
    });

    expect(mockAddToast.mock.calls[0][0]).toMatchSnapshot();
});

test('renders success toast', () => {
    const [, { addToast: mockAddToast }] = useToasts();

    renderHook(useCommonToasts, {
        initialProps: {
            successToastProps: { message: 'Added to favorites list!' }
        }
    });

    expect(mockAddToast.mock.calls[0][0]).toMatchSnapshot();
});
