import { createStore,Store } from "redux";
import Reducer from "./Reducers";
import State from "./state";

function configureStore(initialState) {
  const store = createStore(
    Reducer,
    State
  )
  return store;
}
export default configureStore;