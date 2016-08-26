import {ISPSiteUsers} from './spsecurityservice';
export interface ISpSecurityWebpartWebPartProps {
  description: string;
  users: ISPSiteUsers;
}

export class SpSecurityWebpartWebPartProps implements ISpSecurityWebpartWebPartProps{
  public description: string;
  public users: ISPSiteUsers;
}