import pnp from "sp-pnp-js";
import {
  SPPermission,
  Log
} from "@microsoft/sp-client-base";

export interface ISPSecurableObject {
  id: number;
  RoleAssignments: SPRoleAssignment[];

}

export interface ISPBasePermissions {
  low: number;
  high: number;
}
export interface ISPSiteUser {
  name: string;
  id: number;
}
export interface ISPRoleDefinition {
  id: number;
  basePermissionss: ISPBasePermissions;
  description: string;
  hidden: boolean;
  name: string;

}
export interface ISPRoleAssignment {
  roleDefinitions: number[];
  users: number[];
  groups: number[];
  userId: number;

}
export enum securableType {
  List
}

export interface IPSecurityInfo {
  siteUsers: SPSiteUser[];
  siteGroups: SPSiteGroup[];
  roleDefinitions: ISPRoleDefinition[];
}
export class SPSiteGroup {
  public id: number;
  public title: string;
  public isHiddenInUI: boolean;
  public isShareByEmailGuestUse: boolean;
  public isSiteAdmin: boolean;
  public users: number[];
}
export class SPSiteUser implements ISPSiteUser {
  public name: string;
  public id: number;
}
export class SPRoleDefinition implements ISPRoleDefinition {
  public id: number;
  public basePermissionss: ISPBasePermissions;
  public description: string;
  public hidden: boolean;
  public name: string;

}
export class SPSecurityInfo implements IPSecurityInfo {
  public siteUsers: SPSiteUser[];
  public siteGroups: SPSiteGroup[];
  public roleDefinitions: ISPRoleDefinition[];
  public lists: SPList[];
  public constructor() {

    this.siteUsers = new Array<SPSiteUser>();
    this.siteGroups = new Array<SPSiteGroup>();
    this.roleDefinitions = new Array<SPRoleDefinition>();
    this.siteUsers = new Array<SPSiteUser>();
    this.lists = new Array<SPList>();

  }
}

export class SPList {
  public title: string;
  public id: number;
  public hidden: boolean;
  public serverRelativeUrl: string;
  public type: securableType;
  public itemCount: number;
  public RoleAssignments: ISPRoleAssignment[];
}

export class SPRoleAssignment {
  public roleDefinitionIds: number[] = [];
  public users: SPSiteUser[] = [];
  public groups: SPSiteGroup[] = [];
  public userId: number = 0;


}
export class Helpers {
  public static doesUserHavePermission(securableObject, user, requestedpermission: SPPermission, roles, siteGroups) {

    var permissions = Helpers.getUserPermissions(securableObject, user, roles, siteGroups);
    for (var i = 0; i < permissions.length; i++) {
      // F'in javascript
      //(permissions[i].Low & requestedpermission.low === requestedpermission.low) returns a 1, not true!
      if (
        ((permissions[i].Low & requestedpermission.value.Low) === (requestedpermission.value.Low))
        &&
        ((permissions[i].High & requestedpermission.value.High) === (requestedpermission.value.High))
      ) {
        Log.verbose("Helpers", "user does have permission")
        return true;
      }
    }
    Log.verbose("Helpers", "user does not  have permission")
    return false;
  };
  public static getUserPermissions(securableObject, user, roles, siteGroups) {

    var roleAssignments = Helpers.GetRoleAssignmentsForUser(securableObject, user, siteGroups);
    var roleDefinitionIds = [];
    for (var rax = 0; rax < roleAssignments.length; rax++) {
      for (var rdx = 0; rdx < roleAssignments[rax].roleDefinitionIds.length; rdx++) {
        roleDefinitionIds.push(roleAssignments[rax].roleDefinitionIds[rdx]);
      }
    }


    return Helpers.getBasePermissionsForRoleDefinitiuonIds(roleDefinitionIds, roles);
  };

  public static getBasePermissionsForRoleDefinitiuonIds(roleDefinitionIds, roleDefs) {
    var basePermissions = [];
    for (var rdx = 0; rdx < roleDefs.length; rdx++) {
      for (var rdi = 0; rdi < roleDefinitionIds.length; rdi++) {
        if (roleDefs[rdx].Id === roleDefinitionIds[rdi]) {
          basePermissions.push(roleDefs[rdx].BasePermissions);
        }
      }
    }
    return basePermissions;
  }
  public static getUserPermissionsForObject(securableObject, user, roles: SPRoleDefinition[], siteGroups: SPSiteGroup[]) {

    let roleAssignments: SPRoleAssignment[] = Helpers.GetRoleAssignmentsForUser(securableObject, user, siteGroups);
    let roleDefinitionIds: number[] = [];
    for (var rax = 0; rax < roleAssignments.length; rax++) {
      for (var rdx = 0; rdx < roleAssignments[rax].roleDefinitionIds.length; rdx++) {
        roleDefinitionIds.push(roleAssignments[rax].roleDefinitionIds[rdx]);
      }
    }


    return Helpers.getBasePermissionsForRoleDefinitiuonIds(roleDefinitionIds, roles);
  }
  public static GetRoleAssignmentsForUser(securableObject: ISPSecurableObject, user: SPSiteUser, groups: SPSiteGroup[]): SPRoleAssignment[] {
    let component: Helpers = this;
    let ra = securableObject.RoleAssignments as SPRoleAssignment[];
    let selectedRoleAssignments: SPRoleAssignment[] = [];

    for (let roleAssignment of ra) {

      let users = roleAssignment.users as SPSiteUser[];
      for (let assignedUserId in users) {
        if (parseInt(assignedUserId) === user.id) {
          selectedRoleAssignments.push(roleAssignment);
        }
      }
      let groups2 = groups as SPSiteGroup[];
      for (let group in groups2) {
        debugger;
        // if the user is in the group add the assignment
     //   for (let groupUser in group.Users) {
       //   if (groupUser.Id === user.Id) {
         //   selectedRoleAssignments.push(roleAssignment);
          //}
      ///  }
      }
      //     if (roleAssignment.UserId
      //       && user.UserId
      //       && roleAssignment.UserId.NameId
      //       && roleAssignment.UserId.NameIdIssuer
      //       && roleAssignment.UserId.NameId == user.UserId.NameId
      //       && roleAssignment.UserId.NameIdIssuer == user.UserId.NameIdIssuer) {
      //       selectedRoleAssignments.push(roleAssignment)
      //     }


    }
    return selectedRoleAssignments;

  }
}
export default class SPSecurityService {
  public siteUrl: string;

  public constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }
  public loadData(forceReload: boolean): Promise<SPSecurityInfo> {
    let securityInfo: SPSecurityInfo = new SPSecurityInfo();
    let batch: any = pnp.sp.createBatch();

    pnp.sp.web.inBatch(batch).siteUsers.get().then((response) => {
      securityInfo.siteUsers = response.map((u) => {
        let user: SPSiteUser = new SPSiteUser();
        user.id = u.Id;
        user.name = u.Name;
        return user;
      });
      return securityInfo.siteUsers;
    });
    pnp.sp.web.inBatch(batch).siteGroups.expand("Users").select("Id", "IsHiddenInUI", "IsShareByEmailGuestUse", "IsSiteAdmin", "IsSiteAdmin").get().then((response) => {

      securityInfo.siteGroups = response.map((grp) => {
        let siteGroup: SPSiteGroup = new SPSiteGroup();
        siteGroup.id = grp.Id;
        siteGroup.title = grp.Title;
        siteGroup.users = grp.Users.map((user) => {
          return user.Id;
        });

        return siteGroup;
      });
      return securityInfo.siteGroups;
    });
    pnp.sp.web.inBatch(batch).roleDefinitions.expand("BasePermissions").get().then((response) => {
      securityInfo.roleDefinitions = response.map(function (roleDefinition) {
        roleDefinition.BasePermissions.High = parseInt(roleDefinition.BasePermissions.High);
        roleDefinition.BasePermissions.Low = parseInt(roleDefinition.BasePermissions.Low);
        return roleDefinition;
      });

      return securityInfo.roleDefinitions;
    });
    pnp.sp.web.inBatch(batch).lists.expand("RootFolder", "RoleAssignments", "RoleAssignments/RoleDefinitionBindings", "RoleAssignments/Member", "RoleAssignments/Member/Users", "RoleAssignments/Member/Groups", "RoleAssignments/Member/UserId").get().then((response) => {

      securityInfo.lists = response.map(function (listObject) {
        let mylist = new SPList();

        mylist.title = listObject.Title;
        mylist.id = listObject.Id;
        mylist.hidden = listObject.Hidden;
        mylist.serverRelativeUrl = listObject.RootFolder.ServerRelativeUrl;
        mylist.type = securableType.List;// to differeentiate foldes from lists
        mylist.itemCount = listObject.ItemCount;
        mylist.RoleAssignments = listObject.RoleAssignments.map(function (roleAssignmentObject) {
          let roleAssignment: SPRoleAssignment = new SPRoleAssignment();
          if (roleAssignmentObject.Member.UserId) {
            roleAssignment.userId = roleAssignmentObject.Member.UserId;
          }
          if (roleAssignmentObject.Member.Users) {
            roleAssignment.users = roleAssignmentObject.Member.Users.map(function (user) {
              return user.Id;
            });
          }
          if (roleAssignmentObject.Member.Groips) {
            roleAssignment.groups = roleAssignmentObject.Member.Groups.map(function (group) {
              return group.Id;
            });
          }
          mylist.RoleAssignments = roleAssignmentObject.RoleDefinitionBindings.map(function (roleDefinitionBinding) {
            roleAssignment.roleDefinitionIds.push(roleDefinitionBinding.Id as number);
          });
          return roleAssignment;
        });
        return mylist;
      });

    });
    return batch.execute().then(function (x) {
      return securityInfo;
    });
  }
}