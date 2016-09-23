import { createStore, Store } from "redux";
import RootReducer from "./Reducers";
import State from "./state";

function configureStore(initialState) {
  const store = createStore(
    RootReducer,
    initialState
  );
  return store;
}
export default configureStore;