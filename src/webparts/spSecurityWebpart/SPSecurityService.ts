﻿import pnp from "sp-pnp-js";
import {
  SPPermission,
  Log
} from "@microsoft/sp-client-base";

export interface ISPSecurableObject {
  id: number;
  RoleAssignments: SPRoleAssignment[];

}

export class SPBasePermissions {
  low: number;
  high: number;
  public constructor(high: any, low: any) {
    this.high = parseInt(high);
    this.low = parseInt(low);

  }
}
export enum securableType {
  List
}


export class SPSiteGroup {
  public id: number;
  public title: string;
  public isHiddenInUI: boolean;
  public isShareByEmailGuestUse: boolean;
  public isSiteAdmin: boolean;
  public userIds: number[];
}
export class SPSiteUser {
  public name: string;
  public id: number;
}

export class SPRoleDefinition {
  public id: number;
  public basePermissions: SPBasePermissions;
  public description: string;
  public hidden: boolean;
  public name: string;
  public constructor(id: number, basePermissions: SPBasePermissions, description: string, hidden: boolean, name: string) {
    this.id = id;
    this.basePermissions = basePermissions;
    this.description = description;
    this.hidden = hidden;
    this.name = name;
  }


}
export class SPSecurityInfo {
  public siteUsers: SPSiteUser[];
  public siteGroups: SPSiteGroup[];
  public roleDefinitions: SPRoleDefinition[];
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
  public RoleAssignments: SPRoleAssignment[];
}

export class SPRoleAssignment {
  public roleDefinitionIds: number[] = [];
  public users: SPSiteUser[] = [];
  public groups: SPSiteGroup[] = [];
  public userId: number = 0;


}
export class Helpers {
  public static doesUserHavePermission(securableObject, user, requestedpermission: SPPermission, roles, siteGroups) {

    let permissions: SPBasePermissions[] = Helpers.getUserPermissionsForObject(securableObject, user, roles, siteGroups);
    for (var i = 0; i < permissions.length; i++) {
      // F'in javascript
      //(permissions[i].Low & requestedpermission.low === requestedpermission.low) returns a 1, not true!
      if (
        ((permissions[i].low & requestedpermission.value.Low) === (requestedpermission.value.Low))
        &&
        ((permissions[i].high & requestedpermission.value.High) === (requestedpermission.value.High))
      ) {
        Log.verbose("Helpers", "user does have permission");
        return true;
      }
    }
    Log.verbose("Helpers", "user does not  have permission")
    return false;
  };


  public static getBasePermissionsForRoleDefinitiuonIds(selectedRoleDefinitionIds: number[], roleDefinitions: SPRoleDefinition[]) {
    var basePermissions = [];
    for (let selectedRoleDefinitionId of selectedRoleDefinitionIds) {
      for (let roleDefinition of roleDefinitions) {
        if (roleDefinition.id === selectedRoleDefinitionId) {
          basePermissions.push(roleDefinition.basePermissions);
        }
      }
    }
    //  for (var rdx = 0; rdx < roleDefs.length; rdx++) {
    //    for (var rdi = 0; rdi < roleDefinitionIds.length; rdi++) {basePermission
    //      if (roleDefs[rdx].Id === roleDefinitionIds[rdi]) {
    //        basePermissions.push(roleDefs[rdx].BasePermissions);
    //      }
    //    }
    //  }
    return basePermissions;
  }
  public static getUserPermissionsForObject(securableObject, user, roles: SPRoleDefinition[], siteGroups: SPSiteGroup[]) {

    let roleAssignments: SPRoleAssignment[] = Helpers.GetRoleAssignmentsForUser(securableObject, user, siteGroups);
    let roleDefinitionIds: number[] = [];

    for (let roleAssignment of roleAssignments) {
      for (let roleDefinitionID of roleAssignment.roleDefinitionIds) {
        roleDefinitionIds.push(roleDefinitionID);
      }
    }
    //  for (var rax = 0; rax < roleAssignments.length; rax++) {
    //    for (var rdx = 0; rdx < roleAssignments[rax].roleDefinitionIds.length; rdx++) {
    //      roleDefinitionIds.push(roleAssignments[rax].roleDefinitionIds[rdx]);
    //    }
    //  }

    var userPermissions = Helpers.getBasePermissionsForRoleDefinitiuonIds(roleDefinitionIds, roles);

    return userPermissions;
  }
  public static GetRoleAssignmentsForUser(securableObject: ISPSecurableObject, user: SPSiteUser, groups: SPSiteGroup[]): SPRoleAssignment[] {

    let selectedRoleAssignments: SPRoleAssignment[] = [];

    for (let roleAssignment of securableObject.RoleAssignments) {

      for (let assignedUser of roleAssignment.users) {
        if (assignedUser.id === user.id) {
          selectedRoleAssignments.push(roleAssignment);
        }
      }


      for (let group of groups) {


        // if the user is in the group add the assignment
        for (let groupUserId of group.userIds) {
          if (groupUserId === user.id) {
            selectedRoleAssignments.push(roleAssignment);

          }
        }
        //   if (roleAssignment.userId
        //     && user.UserId
        //    && roleAssignment.UserId.NameId
        //   && roleAssignment.UserId.NameIdIssuer
        //   && roleAssignment.UserId.NameId == user.UserId.NameId
        // && roleAssignment.UserId.NameIdIssuer == user.UserId.NameIdIssuer) {
        //     selectedRoleAssignments.push(roleAssignment)
        //   }


      }

     // Log.verbose("Helpers", "user " + user.id + " has " + selectedRoleAssignments.length + " RoleAssignments");
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
        siteGroup.userIds = grp.Users.map((user) => {
          return user.Id;
        });

        return siteGroup;
      });
      return securityInfo.siteGroups;
    });
    pnp.sp.web.inBatch(batch).roleDefinitions.expand("BasePermissions").get().then((response) => {
      securityInfo.roleDefinitions = response.map(function (response) {

        let bp = new SPBasePermissions(response.BasePermissions.High, response.BasePermissions.Low);
        let roleDefinition: SPRoleDefinition = new SPRoleDefinition(
          parseInt(response.Id),
           bp,
          response.Description,
          response.Hidden,
          response.Name);

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