import {SelectPermissionAction, ActionTypes} from "./actions";
import {Action} from "redux";
import State from "./State";
export default class Reducer {
  public static selectPermissions(oldState: State, selectPermissionAction: SelectPermissionAction): State {
    let newState: State = new State();
    newState.data = oldState.data;
    newState.selectedPermission = selectPermissionAction.permission;
    return newState;
  }
  public static process(oldState: State, action: Action): State {
    switch (action.type) {
      case ActionTypes.SELECTPERMISSION:
        return this.selectPermissions(oldState, action as SelectPermissionAction);

      default:
        return oldState;

    }

  }
}
