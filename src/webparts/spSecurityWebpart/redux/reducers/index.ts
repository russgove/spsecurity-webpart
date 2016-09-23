import { combineReducers ,Action} from "redux";
//const { routerReducer } = require("react-router-redux");
//const formReducer = require("redux-form").reducer;
import filters from "./filters";
import securityInfo from "./securityInfo";
import status from "./status";

const rootReducer = combineReducers({
 filters: filters.filterReducer,
  securityInfo: securityInfo.securityInfoReduducer,
  status:status.statusReducer
});

export default rootReducer;
