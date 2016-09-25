import pnp from "sp-pnp-js";
import {
  SPPermission,
  Log
} from "@microsoft/sp-client-base";

export interface ISPSecurableObject {
  id: number;
  RoleAssignments: SPRoleAssignment[];

}

export class SPBasePermissions {
  public low: number;
  public high: number;
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
  public userId: SPExternalUser;
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
  public isExpanded: boolean;
  public hasBeenRetrieved: boolean;

}
export class SPListItem {
  public id: number;
  public listTitle: string;
  public type: string;
  public itemCount: number;
  public title: string;
  public serverRelativeUrl: string;
  public roleAssignments: SPRoleAssignment[];
  public isExpanded: boolean;
  public hasBeenRetrieved: boolean;
}
export class SPExternalUser {
  public nameId: string;
  public nameIdIssuer: string;
}
export class SPRoleAssignment {
  public roleDefinitionIds: number[] = [];
  public users: SPSiteUser[] = [];
  public groups: SPSiteGroup[] = [];
  public userId: SPExternalUser;


}
export class Helpers {
  public static doesUserHavePermission(securableObject, user, requestedpermission: SPPermission, roles, siteGroups) {

    const permissions: SPBasePermissions[] = Helpers.getUserPermissionsForObject(securableObject, user, roles, siteGroups);


    for (const permission of permissions) {
      if (
        ((permission.low & requestedpermission.value.Low) === (requestedpermission.value.Low))
        &&
        ((permission.high & requestedpermission.value.High) === (requestedpermission.value.High))
      ) {
        return true;
      }
    }
    return false;
  };


  public static getBasePermissionsForRoleDefinitiuonIds(selectedRoleDefinitionIds: number[], roleDefinitions: SPRoleDefinition[]) {
    let basePermissions = [];
    for (const selectedRoleDefinitionId of selectedRoleDefinitionIds) {
      for (const roleDefinition of roleDefinitions) {
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

    const roleAssignments: SPRoleAssignment[] = Helpers.GetRoleAssignmentsForUser(securableObject, user, siteGroups);
    let roleDefinitionIds: number[] = [];

    for (const roleAssignment of roleAssignments) {
      for (const roleDefinitionID of roleAssignment.roleDefinitionIds) {
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

    for (const roleAssignment of securableObject.RoleAssignments) {

      for (const assignedUser of roleAssignment.users) {
        if (assignedUser.id === user.id) {
          selectedRoleAssignments.push(roleAssignment);
        }
      }

      for (const group of groups) {
        // if the user is in the group add the assignment
        for (const groupUserId of group.userIds) {
          if (groupUserId === user.id) {
            selectedRoleAssignments.push(roleAssignment);

          }
        }
        if (roleAssignment.userId
          && user.userId
          && roleAssignment.userId.nameId
          && roleAssignment.userId.nameIdIssuer
          && roleAssignment.userId.nameId == user.userId.nameId
          && roleAssignment.userId.nameIdIssuer == user.userId.nameIdIssuer) {
          selectedRoleAssignments.push(roleAssignment);
        }


      }

      // Log.verbose("Helpers", "user " + user.id + " has " + selectedRoleAssignments.length + " RoleAssignments");
    }
    return selectedRoleAssignments;
  }
}
export default class spSecurityService {
  public siteUrl: string;

  public constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }
  public loadFolderRoleAssigmentsDefinitionsMembers(listTitle, folderServerRelativeUrl, forceReload): Promise<SPListItem[]> {

    // pnp.sp.web.lists.getByTitle("Config3").getItemsByCAMLQuery(caml, "RoleAssignments").then(show);
    let caml = {
      ViewXml: "<View Scope='RecursiveAll'>" +
      " <Query>" +
      "<Where>" +
      "   <Eq>" +
      "      <FieldRef Name='FileDirRef'/>" +
      "     <Value Type='Lookup'>" +
      folderServerRelativeUrl +
      "    </Value>" +
      " </Eq>" +
      " </Where>" +
      "  </Query>" +
      //               "     <QueryOptions>"+
      //    "<ViewAttributes Scope='RecursiveAll' />" +
      //    "<OptimizeFor>FolderUrls</OptimizeFor>"+

      //"</QueryOptions>"+
      " </View>"
    };
    let camlss = { ViewXml: "<View><ViewFields><FieldRef Name='Title' /><FieldRef Name='RoleAssignments' /></ViewFields><RowLimit>10</RowLimit></View>" };

    return pnp.sp.web.lists.getByTitle(listTitle).getItemsByCAMLQuery(caml, "ContentType", "Folder", "Folder/ParentFolder", "File", "File/ParentFolder", "RoleAssignments", "RoleAssignments/RoleDefinitionBindings", "RoleAssignments/Member", "RoleAssignments/Member/Users", "RoleAssignments/Member/Groups")
      .then((response) => {


        let itemsToAdd: SPListItem[] = [];
        for (let listItem of response) {
          let itemToAdd = new SPListItem();
          itemToAdd.id = listItem.Id;
          itemToAdd.listTitle = listTitle;
          itemToAdd.type = listItem.ContentType.Name;
          itemToAdd.itemCount = listItem.Folder.ItemCount;
          itemToAdd.isExpanded = false;
          itemToAdd.hasBeenRetrieved = false;
          itemToAdd.roleAssignments = [];
          if (listItem.ContentType.Name == "Folder") {
            itemToAdd.title = listItem.Folder.Name;
            itemToAdd.serverRelativeUrl = listItem.Folder.ServerRelativeUrl;
          }
          else {
            itemToAdd.title = listItem.File.Name;
            itemToAdd.serverRelativeUrl = listItem.File.ServerRelativeUrl;
          }
          for (let roleAssignmentObject of listItem.RoleAssignments.results) {
            let roleAssignment;
            roleAssignment = {
              RoleDefinitions: [],
              Users: [],
              Groups: [],
              UserId: {} // external user
            };
            if (roleAssignmentObject.Member.UserId) {
              roleAssignment.UserId = roleAssignmentObject.Member.UserId;
            }
            if (roleAssignmentObject.Member.Users) {
              for (let roleAssignmentMemberUser of roleAssignmentObject.Member.Users.results) {
                roleAssignment.Users.push(roleAssignmentMemberUser.Id);
              }
            }
            if (roleAssignmentObject.Member.Groups) {
              for (let roleAssignmentMemberGroup of roleAssignmentObject.Member.Groups.results) {
                roleAssignment.Groups.push(roleAssignmentMemberGroup.Id);
              }
            }
            for (let roleDefinitionBinding of roleAssignmentObject.RoleDefinitionBindings.results) {
              let roleDefinition;
              roleDefinition = {
                Id: roleDefinitionBinding.Id
              };
              roleAssignment.RoleDefinitions.push(roleDefinition);
            }
            itemToAdd.roleAssignments.push(roleAssignment);
          }
          itemsToAdd.push(itemToAdd);
        }
        return itemsToAdd;
      });
  };
  /// Loads data for intial display
  public loadData(forceReload: boolean): Promise<SPSecurityInfo> {
    let securityInfo: SPSecurityInfo = new SPSecurityInfo();
    let batch: any = pnp.sp.createBatch();

    pnp.sp.web.inBatch(batch).siteUsers.get().then((response) => {
      securityInfo.siteUsers = response.map((u) => {

        let user: SPSiteUser = new SPSiteUser();
        user.id = u.Id;
        user.name = u.Title;
        if (u.UserId) {
          user.userId = new SPExternalUser();
          user.userId.nameId = u.UserId.NameId;
          user.userId.nameIdIssuer = u.UserId.NameIdIssuer;
        }
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
      securityInfo.roleDefinitions = response.map((rd) => {

        const bp = new SPBasePermissions(rd.BasePermissions.High, rd.BasePermissions.Low);
        const roleDefinition: SPRoleDefinition = new SPRoleDefinition(
          parseInt(rd.Id),
          bp,
          rd.Description,
          rd.Hidden,
          rd.Name);

        return roleDefinition;
      });

      return securityInfo.roleDefinitions;
    });
    pnp.sp.web.inBatch(batch).lists.expand("RootFolder", "RoleAssignments", "RoleAssignments/RoleDefinitionBindings", "RoleAssignments/Member", "RoleAssignments/Member/Users", "RoleAssignments/Member/Groups", "RoleAssignments/Member/UserId").get().then((response) => {

      securityInfo.lists = response.map((listObject) => {
        let mylist = new SPList();

        mylist.title = listObject.Title;
        mylist.id = listObject.Id;
        mylist.hidden = listObject.Hidden;
        mylist.serverRelativeUrl = listObject.RootFolder.ServerRelativeUrl;
        mylist.type = securableType.List;// to differeentiate foldes from lists
        mylist.itemCount = listObject.ItemCount;
        mylist.isExpanded = false;
        mylist.hasBeenRetrieved = false;
        mylist.RoleAssignments = listObject.RoleAssignments.map((roleAssignmentObject) => {
          let roleAssignment: SPRoleAssignment = new SPRoleAssignment();
          if (roleAssignmentObject.Member.UserId) {
            roleAssignment.userId = new SPExternalUser();
            roleAssignment.userId.nameId = roleAssignmentObject.Member.UserId.NameId;
            roleAssignment.userId.nameIdIssuer = roleAssignmentObject.Member.UserId.NameIdIssuer;
          }
          if (roleAssignmentObject.Member.Users) {
            roleAssignment.users = roleAssignmentObject.Member.Users.map((user) => {
              return user.Id;
            });
          }
          if (roleAssignmentObject.Member.Groips) {
            roleAssignment.groups = roleAssignmentObject.Member.Groups.map((group) => {
              return group.Id;
            });
          }
          mylist.RoleAssignments = roleAssignmentObject.RoleDefinitionBindings.map((roleDefinitionBinding) => {
            roleAssignment.roleDefinitionIds.push(roleDefinitionBinding.Id as number);
          });
          return roleAssignment;
        });
        return mylist;
      });

    });
    return batch.execute().then(() => {
      return securityInfo;
    });
  }
}