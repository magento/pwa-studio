import { applyMiddleware } from 'redux';

import restrictedAuthPage from '../middleware/restrictedAuthPage';

const middleware = [restrictedAuthPage];

export default applyMiddleware(...middleware);
