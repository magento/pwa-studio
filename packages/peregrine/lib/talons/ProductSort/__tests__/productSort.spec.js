import useProductSort from '../productSort';

const defaultMethods = [
    {
        attribute: 'relevance',
        id: 'sortItem.relevance',
        sortDirection: 'DESC',
        text: 'Best Match'
    },
    {
        attribute: 'position',
        id: 'sortItem.position',
        sortDirection: 'ASC',
        text: 'Position'
    },
    {
        attribute: 'price',
        id: 'sortItem.priceDesc',
        sortDirection: 'DESC',
        text: 'Price: High to Low'
    },
    {
        attribute: 'price',
        id: 'sortItem.priceAsc',
        sortDirection: 'ASC',
        text: 'Price: Low to High'
    }
];
const testProps = [
    {
        id: 'testProps.test',
        text: 'Test Props',
        attribute: 'test',
        sortDirection: 'ASC'
    }
];

describe('useProductSort', () => {
    it('Should merge default values and incoming values and alphabetically order', () => {
        const talonProps = useProductSort({ sortingMethods: testProps });

        const { orderedAvailableSortMethods } = talonProps;

        const result = [orderedAvailableSortMethods, testProps].flat();

        expect(orderedAvailableSortMethods).toEqual(result);
    });
});
