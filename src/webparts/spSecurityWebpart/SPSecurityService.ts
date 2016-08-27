import pnp from "sp-pnp-js";
export interface ISPSiteGroup {
   id: number;
   isHiddenInUI: boolean;
   isShareByEmailGuestUse: boolean;
   isSiteAdmin: boolean;
}

export class SPSiteGroup implements ISPSiteGroup{
  public id: number;
  public isHiddenInUI: boolean;
  public isShareByEmailGuestUse: boolean;
  public isSiteAdmin: boolean;
}
export interface ISPSiteUser {
   name: string;
   id: number;
}
export class SPSiteUser implements ISPSiteUser {
  public name: string;
public   id: number;
}
export interface IPSecurityInfo {
   siteUsers: SPSiteUser[];
   siteGroups: SPSiteGroup[];
}
export class SPSecurityInfo implements IPSecurityInfo{
  public siteUsers: SPSiteUser[];
  public siteGroups: SPSiteGroup[];
}
export default class SPSecurityService {
  public siteUrl: string;

  public constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }
  public loadData(forceReload: boolean): Promise<SPSecurityInfo> {
    let securityInfo: SPSecurityInfo = new SPSecurityInfo();
    let batch: any = pnp.sp.createBatch();
    let siteUsersPromise: Promise<ISPSiteUser[]> = pnp.sp.web.inBatch(batch).siteUsers.get().then((response) => {
      let siteUsers: SPSiteUser[] = [];
      for (let i: number = 0; i < response.length; i++) {
        let siteuser: SPSiteUser = new SPSiteUser();
        siteuser.id = 1;
        siteuser.name = "'Koe";
        siteUsers.push(siteuser);
      }
     return siteUsers;
    });
    let siteGroupsPromise: Promise<ISPSiteGroup[]> = pnp.sp.web.inBatch(batch).siteGroups.expand("Users").select("Id", "IsHiddenInUI", "IsShareByEmailGuestUse", "IsSiteAdmin", "IsSiteAdmin").get().then((response) => {
      let siteGroups: SPSiteGroup[] = [];
      for (let i: number = 0; i < response.length; i++) {
        let siteGroup: SPSiteGroup = new SPSiteGroup();
        siteGroup.id = response[i].Id;
        siteGroup.isHiddenInUI = response[i].IsHiddenInUI;
        siteGroup.isShareByEmailGuestUse = response[i].IsShareByEmailGuestUse;
        siteGroup.isSiteAdmin = response[i].IsSiteAdmin;
      }
      return siteGroups;
    });
    batch.execute(); //<=== i thought this should return a promise
    let promises: any = [siteGroupsPromise, siteUsersPromise];

    let returnVal: Promise<IPSecurityInfo> = Promise.all(promises).then(function (values) {
      let spSecurityInfo: SPSecurityInfo = new SPSecurityInfo();
      let x = values[0];


      return spSecurityInfo;

    });
    return returnVal;
  };
  public loadSiteUsers(forceReload: boolean): Promise<SPSiteUser[]> {
    return pnp.sp.web.siteUsers.get().then((response) => {
      debugger;

      let siteUsers: SPSiteUser[] = [];
      for (let i: number = 0; i < response.length; i++) {
        let siteuser: SPSiteUser = new SPSiteUser();
        siteuser.id = 1;
        siteuser.name = "'Koe";
        siteUsers.push(siteuser);
      }
      return siteUsers;
    }).catch((error) => {
      alert(error);
      return error;
    });
  };
}



