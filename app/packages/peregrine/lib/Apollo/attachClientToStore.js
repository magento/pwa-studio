import { extraArgument } from '../store/middleware/thunk';

const attachClientToStore = apolloClient => {
    Object.assign(extraArgument, { apolloClient });
};

export default attachClientToStore;
