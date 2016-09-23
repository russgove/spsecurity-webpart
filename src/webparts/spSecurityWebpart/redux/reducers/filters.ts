import {
  SELECTPERMISSION

} from '../constants';
import { fromJS } from 'immutable';
import {SelectPermissionAction} from "../actions";

const INITIAL_STATE = fromJS({
  selectedPermission:""
});

function filterReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {


//  case SELECTPERMISSION:


  default:
    return state;
  }
}


export default filterReducer;