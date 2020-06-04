import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthorisedVal: boolean;
  constructor() { }
  isAuthorised() {
    if (localStorage.getItem("username") == null) {
      this.isAuthorisedVal = false;
      return this.isAuthorisedVal;
    } else {
      this.isAuthorisedVal = true;
      return this.isAuthorisedVal;
    }
  }
}