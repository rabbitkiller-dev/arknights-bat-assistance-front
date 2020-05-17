import {Component} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {SelectCharacterModelComponent} from './select-character.model.component';

@Component({
  template: `
    <ion-list #ionList>
      <ion-item button (click)="showSelectCharacter($event)">添加干员</ion-item>
    </ion-list>
  `
})
export class Tab3RightTopPopoverComponent {
  constructor(public modalController: ModalController, public popoverController: PopoverController) {
  }

  async showSelectCharacter($event) {
    const modal = await this.modalController.create({
      component: SelectCharacterModelComponent,
    });
    modal.addEventListener('confirm', this.selectCharacterHandler.bind(this));
    modal.addEventListener('done', this.selectCharacterHandler.bind(this));

    modal.onWillDismiss().then((result) => {
      if (result.data.dismissed) {
        this.popoverController.dismiss({dismissed: true});
        return;
      }
      this.popoverController.dismiss(result, 'addCharacter');
    });
    return await modal.present();
  }

  async selectCharacterHandler($event) {
    console.log($event);
  }
}
