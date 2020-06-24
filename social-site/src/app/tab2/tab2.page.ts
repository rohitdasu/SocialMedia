import { Component } from "@angular/core";
import { ApicallsService } from "../shared/apicalls.service";
import { interval } from "rxjs";
import { AlertController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  mystatus: any;
  spinner: boolean = false;
  username;
  statusStatus: string;
  token = localStorage.getItem("token");
  constructor(
    private myapi: ApicallsService,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    this.username = localStorage.getItem("username");
    this.getMystatus();
    this.iterateFunction();
  }
  statusUpdate() {
    if (this.statusStatus == undefined) {
      this.emptyFields();
    } else {
      this.spinner = true;
      let username = localStorage.getItem("username");
      this.myapi
        .statusUpdate(this.statusStatus, username, this.token)
        .subscribe((data) => {
          if (data == true) {
            this.spinner = false;
            this.success();
          } else {
            this.spinner = false;
            this.failed();
          }
        });
    }
  }
  getMystatus() {
    this.myapi.getMystatus(this.username, this.token).subscribe((Response) => {
      var x = JSON.parse(JSON.stringify(Response));
      x.reverse();
      this.mystatus = x;
    });
  }

  iterateFunction() {
    interval(5000).subscribe((x) => {
      this.getMystatus();
    });
  }
  async emptyFields() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "Empty Field",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async failed() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "something went wrong",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async success() {
    const alert = await this.alertController.create({
      header: "success",
      message: "Status Added",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
