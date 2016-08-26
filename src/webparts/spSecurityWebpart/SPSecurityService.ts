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
      return response;
    }).catch((error) => {
      alert(error);
      return error;
    });
  };
}



