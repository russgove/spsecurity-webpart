import { createStore, Store, applyMiddleware} from "redux";
import RootReducer from "./Reducers";
import State from "./state";
import thunkMiddleware from 'redux-thunk';

function configureStore(initialState) {
  const store = createStore(
    RootReducer,
    initialState,
    applyMiddleware(thunkMiddleware)
  );
  return store;
}
export default configureStore;