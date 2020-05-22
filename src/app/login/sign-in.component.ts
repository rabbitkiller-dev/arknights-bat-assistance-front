import {Component} from '@angular/core';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {CharacterService} from '../service/character.service';
import {IoService} from '../service/io.service';
// @ts-ignore
import platform from 'platform';
import {Router} from '@angular/router';

@Component({
  selector: 'login',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>登录</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-item>
          <ion-label position="stacked">用户名</ion-label>
          <ion-input clearInput="true" [(ngModel)]="username"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">密码</ion-label>
          <ion-input type="password" clearInput="true" [(ngModel)]="password"></ion-input>
        </ion-item>
        <ion-button type="submit" expand="block" (click)="login()">登录</ion-button>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./login.component.scss'],
})
export class SignInComponent {
  username: string;
  password: string;

  constructor(
    private modalCtrl: ModalController,
    public ioService: IoService,
    public router: Router,
    public characterService: CharacterService,
    public alertController: AlertController,
    public loadingController: LoadingController,
  ) {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async login() {
    const loading = await this.loadingController.create({
      spinner: null,
      // duration: 5000,
      message: '登录中...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    loading.present();
    await this.ioService.login(this.username, this.password, platform.os.family, platform.name, platform.description);
    await loading.dismiss();
    this.router.navigateByUrl('/');
    this.modalCtrl.dismiss({
      dismissed: false
    });
  }
}
