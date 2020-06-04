import { Component, OnInit } from "@angular/core";
import { ApicallsService } from "../shared/apicalls.service";
import { Iuserdata } from "../shared/iuserdata";
import { Router } from "@angular/router";
import { interval } from "rxjs";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  userdata: any;
  password: string;
  phone: string;
  email: string;
  username: string;
  name: string;
  userValue: Iuserdata;
  constructor(private myapi: ApicallsService, private _router: Router) {
    this.iterateFunction();
  }
  ngOnInit(): void {
    this.getUserinfo();
  }
  gotoAbout() {
    this._router.navigate(["about"]);
  }
  logout() {
    localStorage.clear();
    this._router.navigate(["/"]);
  }
  gotoEditPassword() {
    this._router.navigate(["/editpassword"]);
  }
  iterateFunction() {
    interval(5000).subscribe((x) => {
      this.getUserinfo();
    });
  }
  getUserinfo() {
    if (localStorage.getItem("username") == null) {
    } else {
      this.myapi
        .getUserinfo(localStorage.getItem("username"))
        .subscribe((userinfo) => {
          this.userdata = userinfo;
          this.userdata = JSON.stringify(this.userdata);
          this.userdata = JSON.parse(this.userdata.slice(1, -1));
          this.userValue = this.userdata;
          this.username = this.userValue.username;
          this.phone = this.userValue.phone;
          this.password = this.userValue.password;
          localStorage.setItem("password", this.password);
          this.name = this.userValue.name;
          this.email = this.userValue.email;
        });
    }
  }
}