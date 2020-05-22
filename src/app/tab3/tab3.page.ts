import {Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {IonList, ModalController, PopoverController} from '@ionic/angular';
import {Tab3RightTopPopoverComponent} from './tab3-right-top.popover.component';
import {CharacterService} from '../service/character.service';
import {HttpClient} from '@angular/common/http';
import {CharacterDataModel} from '../model/character-data.model';
import {IoService} from '../service/io.service';
import {CharAttrEditModelComponent} from './char-attr-edit.model.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  // 我的干员列表
  myCharacterList: CharacterDataModel[];
  @ViewChild('ionList') ionList: ComponentRef<HTMLElement>;

  constructor(
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
    public characterService: CharacterService,
    public httpClient: HttpClient,
    public ioService: IoService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.myCharacterList = this.characterService.myCharacterTableModel;
  }

  async presentPopover($event) {
    const popover = await this.popoverController.create({
      component: Tab3RightTopPopoverComponent,
      event: $event,
      translucent: true,
    });
    popover.onWillDismiss().then(async (result) => {
      if (!result.data || result.data.dismissed) {
        return;
      }
      if (result.role === 'addCharacter') {
        await this.ioService.fetch('addCharacter', result.data);
        await this.characterService.initMyCharacterTableModel();
        this.myCharacterList = this.characterService.myCharacterTableModel;
      }
    });
    return await popover.present();
  }

  async openModifyChar($event, item) {
    const modal = await this.modalCtrl.create({
      component: CharAttrEditModelComponent,
      componentProps: {
        type: 'update',
        code: item.code,
        data: item,
      },
    });
    modal.onWillDismiss().then(async (result) => {
      if (result.data.dismissed) {
        return;
      }
      await this.ioService.fetch('changeCharacter', result.data);
      const char = this.myCharacterList.find((_char) => {
        return _char.code === result.data.code;
      });
      if (char) {
        const charData = this.characterService.profileCharacterDataModel(result.data);
        char.avatar = charData.avatar;
        char.phase = charData.phase;
        char.level = charData.level;
        char.potentialRank = charData.potentialRank;
        char.skills = charData.skills;
      } else {
        await this.characterService.initMyCharacterTableModel();
        this.myCharacterList = this.characterService.myCharacterTableModel;
      }
    });
    return await modal.present();
  }
}
