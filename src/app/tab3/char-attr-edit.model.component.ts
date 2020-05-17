import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {CharacterService} from '../service/character.service';
import {CharacterDataModel} from '../model/character-data.model';

/**
 * 干员属性编辑
 */
@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>编辑干员属性</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="confirm()">
            <ion-icon name="checkmark-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-item>
          <ion-label>精英化</ion-label>
          <ion-select [(ngModel)]="data.phase">
            <ion-select-option [value]="0">无</ion-select-option>
            <ion-select-option [value]="1">精英化一</ion-select-option>
            <ion-select-option [value]="2">精英化二</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item [button]="true" (click)="editLevel()">
          <ion-label>等级</ion-label>
          <ion-note slot="end">Lv {{data.level}}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class CharAttrEditModelComponent implements OnInit {
  @Input() code: string;
  @Input() data: CharacterDataModel;

  constructor(
    private modalCtrl: ModalController,
    public characterService: CharacterService,
    public alertController: AlertController,
  ) {
  }

  ngOnInit(): void {
    if (!this.data) {
      this.data = {
        code: this.code,
        phase: 0,
        level: 0,
      };
    }
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  confirm() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async editLevel() {
    const modal = await this.modalCtrl.create({
      component: CharLevelEditModelComponent,
      componentProps: {
        code: this.code,
        data: this.data,
      }
    });
    modal.onWillDismiss().then((result) => {
      if (result.data.dismissed) {
        return;
      }
      this.data.level = result.data.level;
    });
    return await modal.present();
  }
}

/**
 * 干员等级编辑
 */
@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>干员等级 {{level}}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="confirm()">
            <ion-icon name="checkmark-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-range color="primary" [(ngModel)]="level" min="0" [max]="max" pin="true">
        <span slot="start">Lv 1</span>
        <span slot="end">Lv {{max}}</span>
      </ion-range>

    </ion-content>
  `
})
export class CharLevelEditModelComponent implements OnInit {
  @Input() level = 1;
  @Input() max = 30;

  constructor(
    private modalCtrl: ModalController,
  ) {
  }

  ngOnInit(): void {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  confirm() {
    this.modalCtrl.dismiss({
      dismissed: false,
      level: this.level,
    });
  }

}
