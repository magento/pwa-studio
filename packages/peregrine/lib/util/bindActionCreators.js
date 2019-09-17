import { bindActionCreators } from 'redux';

const getBindFunction = value =>
    typeof value === 'function'
        ? bindActionCreators
        : bindActionCreatorsRecursively;

const bindActionCreatorsRecursively = (actions, dispatch) =>
    Object.entries(actions).reduce((acc, [name, value]) => {
        const bind = getBindFunction(value);
        acc[name] = bind(value, dispatch);
        return acc;
    }, {});

export default bindActionCreatorsRecursively;
