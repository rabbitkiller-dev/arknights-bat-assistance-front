import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, zip} from 'rxjs';
import {CharacterTableModel} from '../model/character-table.model';
import {map} from 'rxjs/operators';
import {CharacterDataModel} from '../model/character-data.model';
import {IoService} from './io.service';

@Injectable({providedIn: 'root'})
export class CharacterService {
  // 我拥有的干员列表
  myCharacterTableModel: CharacterDataModel[];
  // 所有干员信息
  allCharacterTableModel: CharacterTableModel[];
  characterTableMap: {
    [code: string]: {
      skills: Array<{
        skillId: string,
        unlockCond: {
          phase: 0,
          level: 1
        },
        levelUpCostCond: Array<{
          unlockCond: {
            phase: 2,
            level: 1
          },
        }>
      }>, [index: string]: any
    }
  };
  characterAvatarMap: { map: { [key: string]: string }, buildinEvolveMap: { [code: string]: { [key: string]: string } } };

  constructor(
    public httpClient: HttpClient,
    public ioService: IoService,
    ) {

  }

  async init() {
    await this.getCharacterTableMap().toPromise();
    await this.getCharacterAvatarMap().toPromise();
    await this.ioService.fetch<CharacterDataModel[]>('getCharacterList', {});

    this.myCharacterTableModel = await this.ioService.fetch<CharacterDataModel[]>('getCharacterList', {});
    // 格式一下干员列表,简化一下对象
    this.allCharacterTableModel = Object.keys(this.characterTableMap).map((code) => {
      const current = this.characterTableMap[code];
      return {
        code,
        name: current.name,
        description: current.description,
        avatar: this.getAvatarUrl(code, 0)
      };
    }) as CharacterTableModel[];
    this.myCharacterTableModel.map((char) => {
      // 初始化头像
      char.avatar = this.getAvatarUrl(char.code, char.phase);
      this.allCharacterTableModel.find((_char)=> _char.code === char.code).avatar = char.avatar;
      // 获取当前技能
      const allSkills = this.characterTableMap[char.code];
      char.skills = allSkills.skills.filter((skill)=>{
        (skill as any).imgUrl = `assets/data/skills/skill_icon_${skill.skillId}.png`;
        return char.phase >= skill.unlockCond.phase;
      }) as any;
      return char;
    });
  }

  getCharacterTableMap(): Observable<any> {
    return this.httpClient.get('assets/data/character_table.json').pipe(map((result: any) => {
      this.characterTableMap = result;
      return result;
    }));
  }

  getCharacterAvatarMap(): Observable<any> {
    return this.httpClient.get('assets/data/character_avatar.json').pipe(map((result: any) => {
      this.characterAvatarMap = result;
      return result;
    }));
  }

  getMyCharacterListMap(): Observable<CharacterDataModel[]> {
    return this.httpClient.get('assets/data/character_data.json').pipe(map((result: CharacterDataModel[]) => {
      return result;
    }));
  }

  getAvatarUrl(code: string, phase: number): string {
    const phaseSkins = this.characterAvatarMap.buildinEvolveMap[code];
    const skinKey = this.characterAvatarMap.map[phaseSkins[phase]];
    if (skinKey) {
      return skinKey;
    } else {
      return this.characterAvatarMap.map[phaseSkins['0']] || '';
    }
  }

}
