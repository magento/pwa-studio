export const mockAddReducer = jest.fn();
export const mockDispatch = jest.fn();
export const mockGetState = jest.fn();

const mock = jest.fn().mockImplementation(() => ({
    addReducer: mockAddReducer,
    dispatch: mockDispatch,
    getState: mockGetState
}));

export const store = mock;
