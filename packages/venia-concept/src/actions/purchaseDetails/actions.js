import { createActions } from 'redux-actions';

const prefix = 'PURCHASE_DETAILS';

const actionMap = {
    REQUEST: null,
    RECEIVE: null
};

export default createActions(actionMap, { prefix });
