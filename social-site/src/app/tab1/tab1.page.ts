import { Component } from "@angular/core";
import { ApicallsService } from "../shared/apicalls.service";
import { interval } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  slideOptions = {
    pager: false,
    slidesPerView: 3.7,
    autoplay: true,
    loop: true,
  };
  slideOptions1 = {
    pager: true,
    autoplay: true,
    loop: true,
  };
  publicStatus: any;
  users: any;
  token = localStorage.getItem("token");
  constructor(private myapi: ApicallsService, private _router: Router) {
    this.getAllData();
    this.iterateFunction();
  }
  gotoChatRoom() {
    this._router.navigate(["chatroom"]);
  }
  getAllData() {
    this.myapi.getPublicStatus(this.token).subscribe((Response) => {
      var x = JSON.parse(JSON.stringify(Response));
      x.reverse();
      this.publicStatus = x;
    });
    this.myapi.getUsers(this.token).subscribe((Response) => {
      this.users = Response;
    });
  }
  iterateFunction() {
    interval(5000).subscribe((x) => {
      this.getAllData();
    });
  }
}
