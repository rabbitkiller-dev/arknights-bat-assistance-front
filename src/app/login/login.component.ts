import {Component} from '@angular/core';
import {CharacterTableModel} from '../model/character-table.model';
import {CharAttrEditModelComponent} from '../tab3/char-attr-edit.model.component';
import {SignInComponent} from './sign-in.component';
import {AlertController, ModalController} from '@ionic/angular';
import {CharacterService} from '../service/character.service';
import {IoService} from '../service/io.service';

@Component({
  selector: 'login',
  template: `
    <ion-content>
      <div class="ak-box-bg">
        <!--<ion-segment mode="md" [(ngModel)]="currentSegment" (ionChange)="segmentChanged($event)">
          <ion-segment-button value="signIn">
            <ion-label>登录</ion-label>
          </ion-segment-button>
          <ion-segment-button value="signUp">
            <ion-label>注册</ion-label>
          </ion-segment-button>
        </ion-segment>
        <ion-list style="border-radius: 0.5rem">
          <ion-item mode="md">
            <ion-label mode="md" position="stacked">Stacked Label</ion-label>
            <ion-input mode="md"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Stacked Label</ion-label>
            <ion-input></ion-input>
          </ion-item>
        </ion-list>-->
        <div class="buttons">
          <ion-button fill="outline" strong="true" expand="block" (click)="clickSignUp($event)">注册</ion-button>
          <ion-button strong="true" expand="block" (click)="clickSignIn($event)">登录</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  currentSegment = 'signIn';

  constructor(
    private ioService: IoService,
    private modalCtrl: ModalController,
    public characterService: CharacterService,
    public alertController: AlertController,
  ) {
  }

  segmentChanged($event) {
    console.log($event);
  }

  async clickSignIn($event) {
    const modal = await this.modalCtrl.create({
      component: SignInComponent,
    });
    modal.onWillDismiss().then((result) => {
      if (result.data.dismissed) {
        return;
      }
      console.log(result);
    });
    return await modal.present();
  }
}
