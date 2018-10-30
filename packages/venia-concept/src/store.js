import { createStore } from 'redux';

import enhancer from 'src/middleware';
import reducer from 'src/reducers';

export default createStore(reducer, enhancer);
