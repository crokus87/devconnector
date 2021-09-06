import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import setAuthToken from './utils/setAuthToken';

// Variable to store initial state info
const initialState = {};

// variable to store middleware being used
const middleware = [thunk];

// allow Redux to trace action calls
const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });

// Create the Store
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

// initialize current state from redux store for subscription comparison preventing undefined error
let currentState = store.getState();

// setup a store subscription listener to store the user's token in localStorage
store.subscribe(() => {
  // keep track of the previous and current state to compare changes
  let previousState = currentState;
  currentState = store.getState();

  //if the token changes, set the value in localStorage and axios headers
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export default store;
