export const mockGetItem = jest.fn();
export const mockRemoveItem = jest.fn();
export const mockSetItem = jest.fn();

export const mockFn = jest.fn();

export const BrowserPersistence = jest.fn().mockImplementation(() => ({
    getItem: mockGetItem,
    removeItem: mockRemoveItem,
    setItem: mockSetItem
}));

export default BrowserPersistence;
