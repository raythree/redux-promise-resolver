# redux-promise-resolver
A simple middleware for dispatching async redux actions. This is very similar to [redux-promise-thunk](https://github.com/kpaxqin/redux-promise-thunk) except it is a middleware function and does not require [redux-thunk](https://www.npmjs.com/package/redux-thunk). It also includes a mechanism to bypass the successful promise resolution as described below.

## Install

```
npm install redux-promise-resolver
```
## Setup

```javascript
import promiseResolver from 'redux-promise-resolver';

const middewares = [  
  promiseResolver,
  // ... any other middleware
];

const configureStore = (initialState) => {
  return createStore(reducer, initialState, compose(
    applyMiddleware(...middewares)
    )
  );
};
```

## Usage
The promise resolver processes any action that has a ```payload``` property that resolves to a promise. It will immediately dispatch ```<actionType>_REQUEST``` and then resolve the promise. If the promise resolves then ```<actionType>``` will be dispatched with the ```payload``` property set to the resolved value. If the promise is rejected then ```<actionType>_ERROR``` will be dispatched with the ```payload``` set to the error value.

For example:
```javascript

const GET_POSTS = 'myapp/GET_POSTS';
const GET_POSTS_REQUEST = 'myapp/GET_POSTS_REQUEST';
const GET_POSTS_ERROR = 'myapp/GET_POSTS_ERROR';

// get posts action, postService.getPosts() returns a promise
export function getPosts() {
  return { type: GET_POSTS, payload: postService.getPosts() }
}

const initialState = {
  posts: null,
  pending: false;
  error: null;
}

// the reducer
function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_POSTS_REQUEST:
      return {
        ...state,
        pending: true
      };

    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        pending: false
      };

    case GET_POSTS_ERROR:
      return {
        ...state,
        error: action.payload,
        pending: false
      };

    default:
      return state;
  }
}

```
## Passing request data
In addition to the promise passed in the payload property you can also pass data that will be dispatched in the ```<actionType>_REQUEST``` action by including a ```requestData``` property:

```javascript
// get post action, postService.getPost(id) returns a promise
export function getPost(id) {
  return { type: GET_POSTS, payload: postService.getPosts(id), requestData: id }
}

// when the GET_POST_REQUEST action is dispatched the action.requestData will contain the id
```
If no requestData is present the action.requestData property will be set to ```null```. The requestData property will also be included in the ```<actionType>_ERROR``` action.

## Bypassing the action
This is useful for a case where you want to periodically dispatch an async action, but only update if something has changed. For example, you could do a background query for a list of items visible on the screen, show a spinner to indicate the background refresh, and then check the received data to see if there were any changes. By supplying a ```processor``` property that is a function in the action, it will be called when the promise resolves and passed the data. If the function returns ```true``` then the success action will be dispatched with the update data. If the function returns ```false``` then the ```<actionType>_BYPASS``` action will be dispatched instead. This could for example turn off the spinner without updating the data. See the [testCases](https://github.com/raythree/redux-promise-resolver/blob/master/test/testCases.js) for a usage example.

## Testing
```
npm run test
```
