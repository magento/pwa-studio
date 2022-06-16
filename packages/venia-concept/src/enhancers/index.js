import errorHandler from '@magento/peregrine/lib/store/enhancers/errorHandler';
import middleware from './middleware';
import composeEnhancers from '@magento/peregrine/lib/util/composeEnhancers';

const enhancer = composeEnhancers(middleware, errorHandler);

export default enhancer;
