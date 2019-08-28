const initialState = {};

export const addReducer = jest.fn();
export const dispatch = jest.fn();
export const getState = jest.fn(() => initialState);

export default { addReducer, dispatch, getState };
