import {Action} from "redux";
import {SPSecurityInfo,SPListItem } from "../SPSecurityService";
export class ActionTypes {
  public static INIT = "INIT";
  public static SELECTPERMISSION = "SELECTPERMISSION";
  public static SETSTATUS = "SETSTATUS";
  public static EXPANDFOLDER = "EXPANDFOLDER";
  public static COLLAPSEFOLDER = "COLLAPSEFOLDER";
  public static GETFOLDER = "SETSTATUS";
}
export class InitAction implements Action {
  public type = ActionTypes.INIT;
  public spSecurityInfo: SPSecurityInfo;

}

export class SelectPermissionAction implements Action {
  public type = ActionTypes.SELECTPERMISSION;
  public permission: string;
}

export class SetStatusAction implements Action {
  public type = ActionTypes.SETSTATUS;
  public status: string;
}



export class ActionCreators {
  public static selectPermission(permission): Action {
    let action = {
      type: ActionTypes.SELECTPERMISSION,
      permission: permission
    };
    return action;
  }
  public static init(spSecurityInfo: SPSecurityInfo): Action {
    let action = {
      type: ActionTypes.INIT,
      spSecurityInfo: spSecurityInfo
    };
    return action;
  }
  public static setSttatus(status: string): Action {// Actions must be plain objects. NOT CLASSES
    let action = {
      type: ActionTypes.SETSTATUS,
      status: status
    };
    return action;
  }
  public static expandFolder(folderId: string): Action {// Actions must be plain objects. NOT CLASSES
    let action = {
      type: ActionTypes.EXPANDFOLDER,
      folderId: folderId
    };
    return action;
  }
  public static collapseFolder(folderId: string): Action {// Actions must be plain objects. NOT CLASSES
    let action = {
      type: ActionTypes.COLLAPSEFOLDER,
      folderId: folderId
    };
    return action;
  }
   public static getFolder(folderId: string, contents): Action {// Actions must be plain objects. NOT CLASSES
    let action = {
      type: ActionTypes.GETFOLDER,
      contents: contents
    };
    return action;
  }

}