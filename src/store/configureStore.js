import { createStore, applyMiddleware, compose } from 'redux';
import appReducer from '../reducers/appRedcuer';
import thunk from 'redux-thunk';

export default () => {
  const store = createStore(appReducer, compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || compose));
  return store;
}
