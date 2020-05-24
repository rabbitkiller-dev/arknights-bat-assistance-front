import {Component, OnInit, ViewChild} from '@angular/core';
import {IoService} from '../service/io.service';
import {CharacterDataModel} from '../model/character-data.model';
import {CharacterService} from '../service/character.service';
import {IonVirtualScroll} from '@ionic/angular';
import {UserModel} from '../model/user.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  // 支援列表
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  supportList: CharacterDataModel[] = [];
  index = 0;
  total: number;

  constructor(
    public router: Router,
    public ioService: IoService,
    public characterService: CharacterService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.querySupportList();
  }

  async querySupportList(params: { code?: string } = {}, reload: boolean = false): Promise<CharacterDataModel[]> {
    if (reload) {
      this.supportList.length = 0;
      this.index = 0;
    }
    // if (this.total && this.supportList.length >= this.total) {
    //   return;
    // }
    const result = await this.ioService.fetch<{ result: CharacterDataModel[], total: number }>('getSupportList', {
      ...params,
      page: {index: this.index},
    });
    this.index++;
    this.total = result.total;
    result.result.map((char) => {
      return this.characterService.profileCharacterDataModel(char);
    });
    this.supportList.push(...result.result);
    return result.result;
  }

  async loadData($event) {
    await this.querySupportList();
    this.virtualScroll.checkEnd();
    $event.target.complete();
    if (this.total && this.supportList.length >= this.total) {
      $event.target.disabled = true;
    }
  }

  async addFriend(item: CharacterDataModel) {
    this.router.navigate(['/tabs/tab1'], {
      queryParams: {
        id: item.creator._id,
      }
    });
  }

  async doRefresh($event) {
    await this.querySupportList({}, true);
    $event.target.complete();
  }
}
