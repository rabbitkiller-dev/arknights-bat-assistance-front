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
          <ion-select [(ngModel)]="data.phase" (ngModelChange)="changePhase($event)">
            <ion-select-option [value]="0">无</ion-select-option>
            <ion-select-option [value]="1" *ngIf="1 <= maxPhases">精英化一</ion-select-option>
            <ion-select-option [value]="2" *ngIf="2 <= maxPhases">精英化二</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item [button]="true" (click)="editLevel()">
          <ion-label>等级</ion-label>
          <ion-note slot="end">Lv {{data.level}}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>潜能</ion-label>
          <ion-select [(ngModel)]="data.potentialRank" (ngModelChange)="changePhase($event)">
            <ion-select-option [value]="0">无</ion-select-option>
            <ion-select-option [value]="1">一潜</ion-select-option>
            <ion-select-option [value]="2">二潜</ion-select-option>
            <ion-select-option [value]="3">三潜</ion-select-option>
            <ion-select-option [value]="4">四潜</ion-select-option>
            <ion-select-option [value]="5">五潜</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item-divider>
          <ion-label>
            干员技能
          </ion-label>
        </ion-item-divider>
        <ion-item *ngFor="let skill of data.skills">
          <ion-label>{{skill.name}}</ion-label>
          <ion-select [(ngModel)]="skill.level">
            <ion-select-option [value]="1">1</ion-select-option>
            <ion-select-option [value]="2">2</ion-select-option>
            <ion-select-option [value]="3">3</ion-select-option>
            <ion-select-option [value]="4">4</ion-select-option>
            <ion-select-option [value]="5" *ngIf="1 <= data.phase">5</ion-select-option>
            <ion-select-option [value]="6" *ngIf="1 <= data.phase">6</ion-select-option>
            <ion-select-option [value]="7" *ngIf="1 <= data.phase">7</ion-select-option>
            <ion-select-option [value]="8" *ngIf="2 <= data.phase">专精一</ion-select-option>
            <ion-select-option [value]="9" *ngIf="2 <= data.phase">专精二</ion-select-option>
            <ion-select-option [value]="10" *ngIf="2 <= data.phase">专精三</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class CharAttrEditModelComponent implements OnInit {
  levelMap: { [skillId: string]: number } = {}; // 缓存配置的技能等级
  maxPhases = 2; // 最大精英化阶段
  @Input() type: 'update' | 'create' = 'create';
  @Input() code: string;
  @Input() data: CharacterDataModel;

  constructor(
    private modalCtrl: ModalController,
    public characterService: CharacterService,
    public alertController: AlertController,
  ) {
  }

  ngOnInit(): void {
    const data: CharacterDataModel = {
      code: this.code,
      phase: 0,
      level: 1,
      potentialRank: 0,
      skills: [],
    };
    if (this.data) {
      this.data.skills.forEach((skill) => {
        this.levelMap[skill.skillId] = skill.level;
      });
      Object.assign(data, this.data);
    }
    this.data = data;
    this.uploadSkill();
    this.maxPhases = this.characterService.getMaxPhases(this.code);
  }

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

  confirm() {
    this.modalCtrl.dismiss(this.data, 'addCharacter').then(() => {
      if (this.type === 'create') {
        this.modalCtrl.dismiss(this.data, 'addCharacter');
      }
    });
  }

  changePhase($event) {
    // 如果因为变更精英化阶段导致当前等级大于最大等级,设置为最大等级
    if (this.data.level > this.characterService.getMaxLevel(this.code, this.data.phase)) {
      this.data.level = this.characterService.getMaxLevel(this.code, this.data.phase);
    }
    // 更新技能
    this.uploadSkill();
  }

  changeLevel($event) {
    // 更新技能
    this.uploadSkill();
  }

  uploadSkill() {
    this.data.skills.forEach((skill) => {
      this.levelMap[skill.skillId] = skill.level;
    });
    this.data.skills = this.characterService.getSkills(this.code, this.data.phase, this.data.level).map((skill) => {
      const result = {
        skillId: skill.skillId,
        level: this.levelMap[skill.skillId] || 1,
        name: this.characterService.skillTableMap[skill.skillId].levels[0].name
      };
      if (1 < this.data.phase && result.level > 4) {
        result.level = 4;
      } else if (2 < this.data.phase && result.level > 7) {
        result.level = 7;
      }
      return result;
    });
  }

  async editLevel() {
    const modal = await this.modalCtrl.create({
      component: CharLevelEditModelComponent,
      componentProps: {
        code: this.code,
        level: this.data.level,
        max: this.characterService.getMaxLevel(this.code, this.data.phase),
      }
    });
    modal.onWillDismiss().then((result) => {
      if (result.data.dismissed) {
        return;
      }
      this.data.level = result.data.level;
      this.changeLevel(this.data.level);
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
      <ion-range color="primary" [(ngModel)]="level" min="1" [max]="max" pin="true">
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
