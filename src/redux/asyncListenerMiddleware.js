const asyncListenerMiddleware = (...listeners) => store => next => action => {
    // listeners are provided with a picture 
    // of the world before the action is applied
    const preActionState = store.getState();

    // release the action to reducers before 
    // firing additional actions
    next(action);

    // always async
    setTimeout(() => {
        // can have multiple listeners listening 
        // against the same action.type
        listeners.forEach(listener => {
            if (listener[action.type]) {
                listener[action.type](action, store.dispatch, preActionState);
            }
        });
    });
};

export default asyncListenerMiddleware;
