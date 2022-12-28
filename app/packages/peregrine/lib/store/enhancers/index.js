import errorHandler from './errorHandler';
import middleware from './middleware';
import composeEnhancers from '../../util/composeEnhancers';

const enhancer = composeEnhancers(middleware, errorHandler);

export default enhancer;
