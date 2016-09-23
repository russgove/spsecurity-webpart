import { combineReducers ,Action} from 'redux';
const { routerReducer } = require('react-router-redux');
const formReducer = require('redux-form').reducer;
import filters from './filters';
import securityInfo from './securityInfo';

const rootReducer = combineReducers({
  filters,
  securityInfo,
  routing: routerReducer,
  form: formReducer,
});

export default rootReducer;
