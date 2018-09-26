export const mockGetItem = jest.fn();
export const mockRemoveItem = jest.fn();
export const mockSetItem = jest.fn();

const mock = jest.fn().mockImplementation(() => ({
    getItem: mockGetItem,
    removeItem: mockRemoveItem,
    setItem: mockSetItem
}));

export default mock;
