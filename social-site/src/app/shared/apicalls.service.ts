import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ApicallsService {
  apiUrl = "https://status4share-backend.herokuapp.com";
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
  getPublicStatus(token) {
    return this._http.get(this.apiUrl + "/api/publicStatus", {
      headers: { token: token },
    });
  }
  getUsers(token) {
    return this._http.get(this.apiUrl + "/api/viewUsernames", {
      headers: { token: token },
    });
  }
  statusUpdate(status, username, token) {
    return this._http.get(this.apiUrl + "/api/AddpublicStatus", {
      headers: { body: status, username: username, token: token },
    });
  }
  getMystatus(username, token) {
    return this._http.get(this.apiUrl + "/api/myStatus", {
      headers: { username: username, token: token },
    });
  }
  getUserinfo(username,token) {
    return this._http.get(this.apiUrl + "/userinfo", {headers:{username:username,token:token}});
  }
  updatePassword(username, password,token) {
    return this._http.get(this.apiUrl + "/updatePassword", {headers:{username:username,password:password,token:token}});
  }
}
