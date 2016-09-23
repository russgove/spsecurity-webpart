import {SelectPermissionAction, ActionTypes} from "../actions";
import { fromJS } from 'immutable';
import {Action} from "redux";
import {SPSecurityInfo} from "../../SPSecurityService";
const INITIAL_STATE = new SPSecurityInfo();

export default class Reducer {

  public static securityInfoReduducer(oldState: SPSecurityInfo, action: Action): SPSecurityInfo {
    switch (action.type) {

      default:
        return oldState;

    }

  }
}
