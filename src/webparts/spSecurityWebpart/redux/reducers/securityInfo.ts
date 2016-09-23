import { ActionTypes, InitAction} from "../actions";
import { fromJS } from "immutable";
import {Action} from "redux";
import {SPSecurityInfo} from "../../SPSecurityService";
const INITIAL_STATE = new SPSecurityInfo();
export default class SecurityInfoReducer {
  public static securityInfoReduducer( oldState: SPSecurityInfo = INITIAL_STATE, action: InitAction): SPSecurityInfo {
    let newstate: SPSecurityInfo = oldState; // need to cerate new copy here
    switch (action.type) {
      case ActionTypes.INIT:
        let newstate: SPSecurityInfo = oldState; // need to cerate new copy here
        newstate.lists = action.spSecurityInfo.lists;
        newstate.roleDefinitions = action.spSecurityInfo.roleDefinitions;
        newstate.siteGroups = action.spSecurityInfo.siteGroups;
        newstate.siteUsers = action.spSecurityInfo.siteUsers;
        break;
      default:
        return oldState;
    }
    return newstate;
  }
}
