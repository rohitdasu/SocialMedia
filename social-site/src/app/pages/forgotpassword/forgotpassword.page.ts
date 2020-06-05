import { Component, OnInit } from "@angular/core";
import { AlertController, LoadingController } from "@ionic/angular";
import { ApicallsService } from "src/app/shared/apicalls.service";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.page.html",
  styleUrls: ["./forgotpassword.page.scss"],
})
export class ForgotpasswordPage implements OnInit {
  username;
  spinner:boolean=false;
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private myapi: ApicallsService
  ) {}

  ngOnInit() {}
  recover() {
    if (this.username == undefined) {
      this.empty();
    } else {
      this.spinner=true;
      this.myapi.recover(this.username).subscribe((data) => {
        if (data == true) {
          this.spinner=false;
          this.success();
        } else {
          this.spinner=false;
          this.failed();
        }
      });
    }
  }
  async empty() {
    const alert = await this.alertController.create({
      header: "Empty",
      message: "enter the username",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async success() {
    const alert = await this.alertController.create({
      header: "Success",
      message: "Please check your registered mail",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async failed() {
    const alert = await this.alertController.create({
      header: "Failed",
      message: "Something went wrong",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
