import BrowserPersistence from '../simplePersistence';

const NAME = 'UnitTest';
const KEY = `M2_VENIA_BROWSER_PERSISTENCE__${NAME}`;
const MOCK_VALUE = { unit: 'test' };

const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();
const mockSetItem = jest.fn();
const localStorageMock = {
    getItem: mockGetItem,
    removeItem: mockRemoveItem,
    setItem: mockSetItem
};

const instance = new BrowserPersistence(localStorageMock);

/**
 * The BrowserPersistence class enforces a particular shape for
 * the items it writes to storage.
 *
 * This helper function shapes an object to conform to the same structure.
 *
 * @param {object} with properties:
 *   @param {object} value - The value to write to storage.
 *   @param {Number} timeStored - The time at which this value was stored.
 *   @param {Number} ttl - The number of seconds that this item should live in storage.
 */
const shape = ({ value, timeStored, ttl }) => {
    return JSON.stringify({
        value: JSON.stringify(value),
        timeStored,
        ttl
    });
};

describe('getItem', () => {
    test('it returns the item if found', () => {
        // Test Setup: make sure it finds something.
        mockGetItem.mockImplementationOnce(() =>
            shape({
                value: MOCK_VALUE
            })
        );

        // Call the function.
        const result = instance.getItem(NAME);

        // Make assertions.
        expect(result).toEqual(MOCK_VALUE);
    });

    test('it returns undefined if not found', () => {
        // Call the function.
        const result = instance.getItem(NAME);

        // Make assertions.
        expect(result).toBeUndefined();
    });

    test('it removes the item and returns undefined if the item has expired', () => {
        // Test setup: an expired item.
        mockGetItem.mockImplementationOnce(() =>
            shape({
                value: MOCK_VALUE,
                timeStored: 0,
                ttl: 1
            })
        );

        // Call the function.
        const result = instance.getItem(NAME);

        // Make assertions.
        expect(mockRemoveItem).toHaveBeenCalledWith(KEY);
        expect(result).toBeUndefined();
    });
});

describe('setItem', () => {
    test('it puts the item in storage with the correct values', () => {
        // Call the function.
        const MOCK_TTL = 5;
        instance.setItem(NAME, MOCK_VALUE, MOCK_TTL);

        // Make assertions.
        expect(mockSetItem).toHaveBeenCalled();

        const storageKey = mockSetItem.mock.calls[0][0];
        expect(storageKey).toEqual(KEY);

        const storageItem = mockSetItem.mock.calls[0][1];
        const parsedItem = JSON.parse(storageItem);
        const parsedValue = JSON.parse(parsedItem.value);
        expect(parsedItem.timeStored).toBeTruthy();
        expect(parsedItem.ttl).toEqual(MOCK_TTL);
        expect(parsedValue).toEqual(MOCK_VALUE);
    });
});

describe('removeItem', () => {
    test('it returns undefined', () => {
        // Call the function.
        const result = instance.removeItem(NAME);

        // Make assertions.
        expect(result).toBeUndefined();
    });

    test('it removes the item from storage', () => {
        // Call the function.
        instance.removeItem(NAME);

        // Make assertions.
        expect(mockRemoveItem).toBeCalledWith(KEY);
    });
});
