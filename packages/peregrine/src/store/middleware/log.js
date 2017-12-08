const log = store => next => action => {
    const result = next(action);

    console.groupCollapsed(action.type);
    console.group('payload');
    console.log(action.payload);
    console.groupEnd();
    console.group('next state');
    console.log(store.getState());
    console.groupEnd();
    console.groupEnd();

    return result;
};

export default log;
