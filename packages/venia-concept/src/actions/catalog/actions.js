import { createActions } from 'redux-actions';

const prefix = 'CATALOG';

const actionMap = {
    GET_ALL_CATEGORIES: {
        REQUEST: null,
        RECEIVE: null
    }
};

export default createActions(actionMap, { prefix });
