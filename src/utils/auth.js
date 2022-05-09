import Cookies from 'js-cookie';
import localStorage from "@/utils/localStorage";
import { Base64 } from 'js-base64';

const TokenKey = 'Admin-Token'
const MiscList = 'Misc-List'

export function getToken() {
  return localStorage.get(TokenKey)
}

export function setToken(token) {
  return localStorage.set(TokenKey, token)
}

export function removeToken() {
  return localStorage.remove(TokenKey)
}

export function setMiscList(miscList){
  return Cookies.set(MiscList, miscList)
}

export function getMiscList(){
  return Cookies.get(MiscList)
}

export function removeMiscList(){
  return Cookies.remove(MiscList)
}

export function decodeUserInfo(){
  return JSON.parse(Base64.decode(getToken()));
}
