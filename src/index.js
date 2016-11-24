export default ({ dispatch }) => {
  return next => action => {
    if (!action.payload || !action.payload.then) {
      return next(action);
    }

    // Action has a payload property that is a promise, dispatch
    // request type and resolve it. If there is a requestData
    // property include it in the <action>_REQUEST action.

    const requestType = `${action.type}_REQUEST`;
    const successType = action.type;
    const errorType = `${action.type}_ERROR`;
    const bypassType = `${action.type}_BYPASS`;

    let requestData = null;
    if (typeof action.requestData !== 'undefined') {
      requestData = action.requestData;
    }

    dispatch({ type: requestType, requestData: requestData });

    action.payload
    .then((response) => {
      if (action.processor && typeof action.processor === 'function') {
        if (!action.processor(response)) {
          dispatch({ type: bypassType });
          return;
        }
      }
      dispatch({ type: successType, payload: response, requestData: requestData });
    })
    .catch((error) => {
      dispatch({ type: errorType, payload: error, requestData });
    });
  };
};
