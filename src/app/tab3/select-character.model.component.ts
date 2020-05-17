import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CharacterService} from '../service/character.service';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>添加干员</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">关闭</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-virtual-scroll [items]="characterService.allCharacterTableModel" approxItemHeight="320px">
          <!--<ion-card *virtualItem="let item; let itemBounds = bounds;">
            <div>
              <ion-img [src]="item.imgSrc" [height]="item.imgHeight" [alt]="item.name"></ion-img>
            </div>
            <ion-card-header>
              <ion-card-title>{{ item.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{ item.description }}</ion-card-content>
          </ion-card>-->
          <ion-item *virtualItem="let char; let itemBounds = bounds;">
            <ion-avatar slot="start">
              <ion-img [src]="char.avatar"></ion-img>
            </ion-avatar>
            <ion-label>
              <h2>{{char.name}}</h2>
              <p>{{char.description}}</p>
            </ion-label>
          </ion-item>
        </ion-virtual-scroll>
      </ion-list>
    </ion-content>
  `
})
export class SelectCharacterModelComponent implements OnInit {
  // @Output() done: EventEmitter<any> = new EventEmitter();
  constructor(
    private modalCtrl: ModalController,
    public characterService: CharacterService,
  ) {
  }

  ngOnInit(): void {

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true
    });
    // this.done.emit();
  }
}
