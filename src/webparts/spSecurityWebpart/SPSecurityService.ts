import pnp from "sp-pnp-js";
export interface ISPSiteGroup {
  id: number;
  isHiddenInUI: boolean;
  isShareByEmailGuestUse: boolean;
  isSiteAdmin: boolean;
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
export interface ISPList {
  title: string;
  id: number;
  hidden: boolean;
  serverRelativeUrl: string;
  type: securableType;
  itemCount: number;
  RoleAssignments: ISPRoleAssignment[];
}
export interface IPSecurityInfo {
  siteUsers: SPSiteUser[];
  siteGroups: SPSiteGroup[];
  roleDefinitions: ISPRoleDefinition[];
}
export class SPSiteGroup implements ISPSiteGroup {
  public id: number;
  public isHiddenInUI: boolean;
  public isShareByEmailGuestUse: boolean;
  public isSiteAdmin: boolean;
}
export class SPSiteUser implements ISPSiteUser {
  public name: string;
  public id: number;
}
export class SPRoleDefinition implements ISPRoleDefinition {
  public id: number;
  public basePermissionss: ISPBasePermissions;
   public  description: string;
   public  hidden: boolean;
   public  name: string;

}
export class SPSecurityInfo implements IPSecurityInfo {
  public siteUsers: SPSiteUser[];
  public siteGroups: SPSiteGroup[];
  public roleDefinitions: ISPRoleDefinition[];
  public lists: ISPList[];
  public constructor(){

    this.siteUsers= new Array<SPSiteUser>();
  this.siteGroups= new Array<SPSiteGroup>();
  this.roleDefinitions= new Array<SPRoleDefinition>();
  this.siteUsers= new Array<SPSiteUser>();
  this.lists= new Array<SPList>();

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
  public roleDefinitions = [];
  public users = [];
  public groups = [];
  public userId = 0;


}

export default class SPSecurityService {
  public siteUrl: string;

  public constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }
  public loadData(forceReload: boolean): Promise<SPSecurityInfo> {
    let securityInfo: SPSecurityInfo = new SPSecurityInfo();
    let batch: any = pnp.sp.createBatch();

    pnp.sp.web.inBatch(batch).siteUsers.getAs<ISPSiteUser[], any>().then((response) => {
      securityInfo.siteUsers = response;
      return response;
    });
    pnp.sp.web.inBatch(batch).siteGroups.expand("Users").select("Id", "IsHiddenInUI", "IsShareByEmailGuestUse", "IsSiteAdmin", "IsSiteAdmin").getAs<ISPSiteGroup[], any>().then((response) => {
      securityInfo.siteGroups = response;
      return response;
    });
    pnp.sp.web.inBatch(batch).roleDefinitions.expand("BasePermissions").get().then((response) => {
      securityInfo.roleDefinitions = response.map(function (roleDefinition) {
        roleDefinition.BasePermissions.High = parseInt(roleDefinition.BasePermissions.High);
        roleDefinition.BasePermissions.Low = parseInt(roleDefinition.BasePermissions.Low);
        return roleDefinition;
      });
      debugger;
      return securityInfo.roleDefinitions;
    });
    pnp.sp.web.inBatch(batch).lists.expand('RootFolder', 'RoleAssignments', 'RoleAssignments/RoleDefinitionBindings', 'RoleAssignments/Member', 'RoleAssignments/Member/Users', 'RoleAssignments/Member/Groups', 'RoleAssignments/Member/UserId').get().then((response) => {

      securityInfo.lists = response.map(function (listObject) {
        let mylist = new SPList();

        mylist.title = listObject.Title;
        mylist.id = listObject.Id;
        mylist.hidden = listObject.Hidden;
        mylist.serverRelativeUrl = listObject.RootFolder.ServerRelativeUrl;
        mylist.type = securableType.List;// to differeentiate foldes from lists
        mylist.itemCount = listObject.ItemCount;
        mylist.RoleAssignments = listObject.RoleAssignments.map(function (roleAssignmentObject) {
          let roleAssignment: ISPRoleAssignment = new SPRoleAssignment();
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
            roleAssignment.roleDefinitions.push(roleDefinitionBinding.Id as number);
          });
          return securityInfo.lists;
        });
        return mylist;
      });

    });
    return batch.execute().then(function (x) {
      return securityInfo;
    });
  }
}