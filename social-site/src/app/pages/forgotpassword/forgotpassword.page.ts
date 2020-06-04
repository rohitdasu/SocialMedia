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
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private myapi: ApicallsService
  ) {}

  ngOnInit() {}
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 2000,
    });
    await loading.present();
  }
  recover() {
    if (this.username == undefined) {
      this.empty();
    } else {
      this.presentLoading();
      this.myapi.recover(this.username).subscribe((data) => {
        if (data == true) {
          this.success();
        } else {
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
