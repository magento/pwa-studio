export const mockGetItem = jest.fn();
export const mockGetRawItem = jest.fn();
export const mockRemoveItem = jest.fn();
export const mockSetItem = jest.fn();

export const BrowserPersistence = jest.fn().mockImplementation(() => ({
    getItem: mockGetItem,
    getRawItem: mockGetRawItem,
    removeItem: mockRemoveItem,
    setItem: mockSetItem
}));

export default BrowserPersistence;
