import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {CharacterService} from '../service/character.service';

/**
 * 干员属性编辑
 */
@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>编辑属性</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">取消</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
    </ion-content>
  `
})
export class SelectCharacterModelComponent implements OnInit {
  @Input() data: any;
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
