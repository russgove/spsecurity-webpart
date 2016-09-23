import {Action} from "redux";
export class ActionTypes {
  public static INIT = "INIT";
  public static SELECTPERMISSION = "SELECTPERMISSION";
}

export class InitAction implements Action {
  type = ActionTypes.INIT;

}

export class SelectPermissionAction implements Action {
  type = ActionTypes.SELECTPERMISSION;
  permission: string;
}

export class ActionCreators {
  selectPermission(permission): Action {
    let action: Action = new SelectPermissionAction().permission = permission;
    return action;
  }
  init(permission): Action {
    let action: Action = new InitAction();
    return action;
  }


}