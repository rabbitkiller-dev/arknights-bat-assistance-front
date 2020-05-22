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
        <ion-title>注册</ion-title>
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
        <ion-button type="submit" expand="block" (click)="signUp()">注册</ion-button>
      </ion-list>
    </ion-content>
  `,
  styleUrls: ['./login.component.scss'],
})
export class SignUpComponent {
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

  async signUp() {
    const loading = await this.loadingController.create({
      message: '注册中...',
      translucent: true,
    });
    loading.present();
    await this.ioService.register(this.username, this.password, platform.os.family, platform.name, platform.description);
    await loading.dismiss();
    this.router.navigateByUrl('/');
    this.modalCtrl.dismiss({
      dismissed: false
    });
  }
}
