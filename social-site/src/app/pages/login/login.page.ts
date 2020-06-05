import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { ApicallsService } from "src/app/shared/apicalls.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  spinner:boolean=false;
  login = { username: "", password: "" };
  constructor(
    public alertController: AlertController,
    private apicalls: ApicallsService,
    private router: Router,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {}
  formSubmit() {
    if (this.login.username == "" || this.login.password == "") {
      this.emptyFields();
    } else {
      this.spinner=true;
      this.apicalls
        .login(this.login.username, this.login.password)
        .subscribe((data) => {
          if (data == true) {
            this.spinner=false;
            localStorage.setItem("username", this.login.username);
            this.login.username="";
            this.login.password="";
            this.router.navigate(["/tabs"]);
          } else {
            this.spinner=false;
            this.loginFail();
          }
        });
    }
  }
  async emptyFields() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "fill all fields",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async loginFail() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "login failed",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
