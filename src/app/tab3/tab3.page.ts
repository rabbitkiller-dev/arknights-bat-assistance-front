import {Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {IonList, PopoverController} from '@ionic/angular';
import {Tab3RightTopPopoverComponent} from './tab3-right-top.popover.component';
import {CharacterService} from '../service/character.service';
import {HttpClient} from '@angular/common/http';
import {CharacterDataModel} from '../model/character-data.model';
import {IoService} from '../service/io.service';

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
    public popoverController: PopoverController,
    public characterService: CharacterService,
    public httpClient: HttpClient,
    public ioService: IoService,
  ) {

  }

  async ngOnInit(): Promise<void> {

  }

  async presentPopover($event) {
    const popover = await this.popoverController.create({
      component: Tab3RightTopPopoverComponent,
      event: $event,
      translucent: true,
    });
    popover.onWillDismiss().then((result) => {
      if (result.data.dismissed) {
        return;
      }
      if (result.role === 'addCharacter') {
        console.log('addCharacter', result);
      }
    });
    return await popover.present();
  }

}
