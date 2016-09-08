import { createStore, compose, applyMiddleware } from 'redux';
import promiseResolver from '../';

const initialState = {
  message: '',
  pending: false,
  bypassed: false,
};

const SAY_HELLO = 'myapp/SAY_HELLO';
const SAY_HELLO_REQUEST = 'myapp/SAY_HELLO_REQUEST';
const SAY_HELLO_ERROR = 'myapp/SAY_HELLO_ERROR';
const SAY_HELLO_BYPASS = 'myapp/SAY_HELLO_BYPASS';

function delay(msg) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (msg === 'error') {
        reject('error');
      }
      else {
        resolve(msg);
      }
    }, 50);
  });
}

export function sayHello(msg, processor, requestData) {
  return { type: SAY_HELLO, payload: delay(msg), processor, requestData};
}

function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SAY_HELLO_REQUEST:
      return {
        ...state,
        pending: true,
        requestData: action.requestData
      };

    case SAY_HELLO:
      return {
        ...state,
        message: action.payload,
        pending: false
      };

    case SAY_HELLO_ERROR:
      return {
        ...state,
        error: action.payload,
        pending: false
      };

    case SAY_HELLO_BYPASS:
    return {
      ...state,
      pending: false,
      bypassed: true
    };

    default:
      return state;
  }
}

const middewares = [
  promiseResolver,
];

const configureStore = (initialState) => {
  return createStore(reducer, initialState, compose(
    applyMiddleware(...middewares)
    )
  );
};

export default configureStore;
