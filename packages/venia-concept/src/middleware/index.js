import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import log from './log';

export default applyMiddleware(thunk, log);
