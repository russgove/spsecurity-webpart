import {SPSecurityInfo} from "../SPSecurityService";
export default class State {
  selectedPermission: string = "read";
  data: SPSecurityInfo= new SPSecurityInfo();

}