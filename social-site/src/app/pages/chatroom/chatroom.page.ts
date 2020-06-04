import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Socket } from "ngx-socket-io";
@Component({
  selector: "app-chatroom",
  templateUrl: "./chatroom.page.html",
  styleUrls: ["./chatroom.page.scss"],
})
export class ChatroomPage implements OnInit {
  message = "";
  messages = [];
  currentUser = "";
  constructor(
    private socket: Socket,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.socket.connect();
    let name = `User-${new Date().getTime()}`;
    this.currentUser = name;

    this.socket.emit("set-name", this.currentUser);

    this.socket.fromEvent("users-changed").subscribe((data) => {
      let user = data["user"];
      if (data["event"] == "left") {
        this.showToast(`User left:${user}`);
      } else {
        this.showToast(`User Joined:${user}`);
      }
    });
    this.socket.fromEvent("message").subscribe((message) => {
      console.log("new :", message);
      this.messages.push(message);
    });
  }
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: "middle",
      duration: 3000,
    });
    toast.present();
  }
  sendMessage() {
    this.socket.emit("send-message", { text: this.message });
    this.message = "";
  }
  ionViewWillLeave() {
    this.socket.disconnect();
  }
}
