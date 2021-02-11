import thunk from 'redux-thunk';

export const extraArgument = {};
export default thunk.withExtraArgument(extraArgument);
