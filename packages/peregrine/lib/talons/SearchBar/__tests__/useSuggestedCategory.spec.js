import { useSuggestedCategory } from '../useSuggestedCategory';

jest.mock('react', () => {
    const react = jest.requireActual('react');

    return {
        ...react,
        useCallback: jest.fn(func => func)
    };
});

jest.mock('react-router-dom', () => ({
    useLocation: jest.fn(() => ({}))
}));

const props = {
    categoryId: 1,
    label: 'foo',
    searchValue: 'bar'
};

describe('#useSuggestedCategory', () => {
    test('triggers onNavigate prop when clicked', () => {
        const onNavigate = jest.fn();

        const { handleClick } = useSuggestedCategory({
            ...props,
            onNavigate
        });

        handleClick();

        expect(onNavigate).toHaveBeenCalled();
    });

    test('returns valid destination', () => {
        const { destination } = useSuggestedCategory(props);

        expect(destination.indexOf('/search.html')).toBe(0);
        expect(destination).toMatchSnapshot();
    });
});
