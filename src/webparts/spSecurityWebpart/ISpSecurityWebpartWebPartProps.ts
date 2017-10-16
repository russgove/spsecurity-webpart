import {SPSiteUser} from "./SPsecurityservice";
import {
  SPPermission,

} from "@microsoft/sp-client-base";

export interface ISpSecurityWebpartWebPartProps {
  description: string;
  users: SPSiteUser[];
  permission:SPPermission;
}

export class SpSecurityWebpartWebPartProps implements ISpSecurityWebpartWebPartProps{
  public description: string;
  public users: SPSiteUser[];
  public permission:SPPermission;
}