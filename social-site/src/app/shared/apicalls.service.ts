import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApicallsService {
  apiUrl = "https://status-backend.herokuapp.com";
  constructor(private _http: HttpClient, private router: Router) {}
  login(username, password) {
    var data = {
      username: username,
      password: password,
    };
    return this._http.post(this.apiUrl + "/login-user", data);
  }
  register(username, name, password, phone, email) {
    var data = {
      username: username,
      name: name,
      password: password,
      phone: phone,
      email: email,
    };
    return this._http.post(this.apiUrl + "/add-user", data);
  }
  recover(username) {
    var data = {
      username: username,
    };
    return this._http.post(this.apiUrl + "/recoverPassword", data);
  }
  getPublicStatus() {
    return this._http.get(this.apiUrl + "/api/publicStatus");
  }
  getUsers() {
    return this._http.get(this.apiUrl + "/api/viewUsernames");
  }
  statusUpdate(status, username) {
    var data = {
      body: status,
      username: username,
    };
    return this._http.post(this.apiUrl + "/api/publicStatus", data);
  }
  getMystatus(username) {
    var data = {
      username: username,
    };
    return this._http.post(this.apiUrl + "/api/myStatus", data);
  }
  getUserinfo(username) {
    var data = {
      username: username,
    };
    return this._http.post(this.apiUrl + "/userinfo", data);
  }
  updatePassword(username, password) {
    var data = {
      username: username,
      password: password,
    };
    return this._http.post(this.apiUrl + "/updatePassword", data);
  }
}
