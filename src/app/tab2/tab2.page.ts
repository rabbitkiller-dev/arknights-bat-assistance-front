import {Component, OnInit, ViewChild} from '@angular/core';
import {IoService} from '../service/io.service';
import {CharacterDataModel} from '../model/character-data.model';
import {CharacterService} from '../service/character.service';
import {IonVirtualScroll} from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  // 支援列表
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  supportList: CharacterDataModel[] = [];
  supportList2: CharacterDataModel[] = [];

  constructor(
    public ioService: IoService,
    public characterService: CharacterService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.supportList = await this.querySupportList();
    console.log(this.supportList);
    this.supportList2 = [...this.supportList, ...this.supportList]
  }

  async querySupportList(params?: { code?: string }): Promise<CharacterDataModel[]> {
    const supportList: CharacterDataModel[] = await this.ioService.fetch<CharacterDataModel[]>('getSupportList', params || {});
    supportList.map((char) => {
      return this.characterService.profileCharacterDataModel(char);
    });
    return supportList;
  }

  loadData($event) {
    setTimeout(() => {
      console.log('done', $event);
      this.supportList2.push(...this.supportList);
      console.log(this.virtualScroll.checkRange)
      this.virtualScroll.checkEnd();
      $event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.supportList2.length == 1000) {
        $event.target.disabled = true;
      }
    }, 2000);
  }
}
