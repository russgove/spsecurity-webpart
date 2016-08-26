import pnp from "sp-pnp-js";


export interface ISPSiteUser {
  name: string;
  id: number;
}
export interface ISPSiteUsers {
  value: ISPSiteUser[];
}
export class SPSiteUser implements ISPSiteUser {
 public name: string;
 public id: number;
}
export class SPSiteUsers implements ISPSiteUsers {
  public value: ISPSiteUser[]= null;
}

export default class SPSecurityService {
  public siteUrl: string;

  public constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }
  public loadSiteUsers(forceReload: boolean): Promise<ISPSiteUsers> {
    return pnp.sp.web.siteUsers.get().then((response) => {
      debugger;

      let siteUsers: SPSiteUsers = new SPSiteUsers();
      for (let row: any in response) {
        let siteuser: SPSiteUser = new SPSiteUser();
        siteuser.id = 1;
        siteuser.name =  "'Koe";
        ISPSiteUsers.add(siteuser);
      }
      return siteUsers;
    }).catch((error) => {
      alert(error);
      return error;
    });
  };
}



