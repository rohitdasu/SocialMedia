import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from "@angular/forms";
import { AlertController, LoadingController } from "@ionic/angular";
import { ApicallsService } from "src/app/shared/apicalls.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  register = { username: "", password: "", name: "", phone: "", email: "" };
  formRegister: FormGroup;
  phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  constructor(
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private apicalls: ApicallsService,
    private router: Router
  ) {}

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 3000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      username: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ])
      ),
      name: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      phone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(this.phonePattern),
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.email])
      ),
    });
    const controls = this.formRegister.controls;
  }
  get registerFormControl() {
    return this.formRegister.controls;
  }
  formSubmit() {
    if (this.formRegister.valid) {
      this.presentLoading();
      this.apicalls
        .register(
          this.register.username,
          this.register.name,
          this.register.password,
          this.register.phone,
          this.register.email
        )
        .subscribe((data) => {
          if (data == true) {
            this.success();
          } else {
            this.failed();
          }
        });
    } else {
      this.emptyFields();
    }
  }
  async emptyFields() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "Invalid Form",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async success() {
    const alert = await this.alertController.create({
      header: "Success",
      message: "Please verify the email",
      buttons: ["OK"],
    });

    await alert.present();
  }
  async failed() {
    const alert = await this.alertController.create({
      header: "Alert",
      message: "Something went wrong",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
