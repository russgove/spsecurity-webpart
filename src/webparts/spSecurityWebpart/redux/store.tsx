import { createStore } from "redux";
import Reducer from "./Reducers";
import State from "./state";
let store = createStore(Reducer.process,State);