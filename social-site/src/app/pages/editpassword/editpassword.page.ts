import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { ApicallsService } from "src/app/shared/apicalls.service";
import { AlertController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-editpassword",
  templateUrl: "./editpassword.page.html",
  styleUrls: ["./editpassword.page.scss"],
})
export class EditpasswordPage implements OnInit {
  oldPassword: string;
  spinner:boolean=false;
  newPassword: string;
  Formupdate: FormGroup;
  constructor(
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    private myapi: ApicallsService
  ) {
    this.Formupdate = this.formBuilder.group({
      oldPassword: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      newPassword: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }

  async wrongOldPassword() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "Old password incorrect",
      buttons: ["OK"],
    });

    await alert.present();
  }

  async emptyFields() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "Empty Fields",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async fail() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "failed",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async success() {
    const alert = await this.alertController.create({
      header: "Success",
      message: "Password changed!",
      buttons: ["OK"],
    });

    await alert.present();
  }
  ngOnInit() {}
  update() {
    if (this.oldPassword == undefined || this.newPassword == undefined) {
      this.emptyFields();
    } else {
      var data = {
        password: this.newPassword,
        username: localStorage.getItem("username"),
      };
      if (localStorage.getItem("password") != this.oldPassword) {
        this.wrongOldPassword();
      } else {
        if (this.Formupdate.valid) {
          this.spinner=true;
          this.myapi
            .updatePassword(data.username, data.password)
            .subscribe((Response) => {
              if (Response == true) {
                this.spinner=false;
                this.success();
              } else {
                this.spinner=false;
                this.fail();
              }
            });
        } else {
          alert("not valid form");
        }
      }
    }
  }
}
