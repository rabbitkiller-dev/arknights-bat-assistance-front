import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CharacterService} from '../service/character.service';
import {CharacterTableModel} from '../model/character-table.model';
import {CharAttrEditModelComponent} from './char-attr-edit.model.component';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>添加干员</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="confirm()">
            <ion-icon name="checkmark-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-virtual-scroll [items]="characterService.allCharacterTableModel" approxItemHeight="320px">
          <ion-item *virtualItem="let char; let itemBounds = bounds;" (click)="clickChar(char)">
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
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  confirm() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  async clickChar(char: CharacterTableModel){
    const modal = await this.modalCtrl.create({
      component: CharAttrEditModelComponent,
      componentProps: {
        code: char.code,
      }
    });
    // this.modalCtrl.dismiss(char);
    return await modal.present();
  }
}
