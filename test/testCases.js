import configureStore, {sayHello} from './createStore';
const assert = require('assert');

describe('test suite', function() {

  let store;
  beforeEach(function () {
    store = configureStore();
  });

  it('should make sure the store is properly configured', function () {
    let state = store.getState();
    assert(state.message === '');
    assert(state.pending === false);
    assert(state.bypassed === false);
    assert(typeof sayHello === 'function');
  });

  it('should handle resolved async actions', function (done) {
    store.dispatch(sayHello('Hello'));
    let state = store.getState();
    assert(state.message === '');
    assert(state.pending === true);
    assert(state.requestData === null);

    setTimeout(() => {
      state = store.getState();
      assert(state.message === 'Hello');
      assert(!state.pending);
      done();
    }, 60);
  });

  it('should handle resolved async actions with request data', function (done) {
    store.dispatch(sayHello('Hello', null, 'request data'));
    let state = store.getState();
    assert(state.message === '');
    assert(state.pending === true);
    assert(state.requestData === 'request data');

    setTimeout(() => {
      state = store.getState();
      assert(state.message === 'Hello');
      assert(!state.pending);
      done();
    }, 60);
  });

  it('should handle async errors', function (done) {
    store.dispatch(sayHello('error'));
    let state = store.getState();
    assert(state.message === '');
    assert(state.pending === true);

    setTimeout(() => {
      state = store.getState();
      assert(state.error === 'error');
      assert(!state.pending);
      done();
    }, 60);
  });

  it('should call the bypass function', function (done) {
    let called = false;
    let calledWith = null;
    function processor(data) {
      called = true;
      calledWith = data;
      return true;
    }

    store.dispatch(sayHello('Hello', processor));
    let state = store.getState();
    assert(state.message === '');
    assert(state.pending === true);

    setTimeout(() => {
      state = store.getState();
      assert(state.message === 'Hello');
      assert(!state.pending);

      assert(called);
      assert(calledWith === 'Hello');

      done();
    }, 60);
  });

  it('should bypass the action', function (done) {
    let called = false;
    let calledWith = null;
    function processor(data) {
      called = true;
      calledWith = data;
      return false;
    }

    store.dispatch(sayHello('Hello', processor));
    let state = store.getState();
    assert(state.message === '');
    assert(state.pending === true);

    setTimeout(() => {
      state = store.getState();
      assert(state.message === '');
      assert(!state.pending);
      assert(state.bypassed);
      assert(called);
      assert(calledWith === 'Hello');
      done();
    }, 60);
  });

});
