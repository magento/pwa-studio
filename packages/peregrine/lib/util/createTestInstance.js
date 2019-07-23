import TestRenderer, { act } from 'react-test-renderer';

/*
 * Wrap rendering code in `act()`, for lifecycle purposes.
 *
 * https://reactjs.org/docs/test-utils.html#act
 */
export default (...args) => {
    let instance;

    act(() => {
        instance = TestRenderer.create(...args);
    });

    return instance;
};
