import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, zip} from 'rxjs';
import {CharacterTableModel} from '../model/character-table.model';
import {map} from 'rxjs/operators';
import {CharacterDataModel, CharacterSkillModel} from '../model/character-data.model';
import {IoService} from './io.service';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CharacterService {
  // 我拥有的干员列表
  myCharacterTableModel: CharacterDataModel[];
  // 所有干员信息
  allCharacterTableModel: CharacterTableModel[];
  characterTableMap: {
    [code: string]: {
      profession: string,
      phases: Array<{ maxLevel: number }>,
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
  skillTableMap: {
    [skillId: string]: {
      skillId: string,
      levels: Array<{
        name: string,
        description: string,
      }>
    }
  };

  constructor(
    public httpClient: HttpClient,
    public ioService: IoService,
  ) {

  }

  async init() {
    await this.getCharacterTableMap().toPromise();
    await this.getCharacterAvatarMap().toPromise();
    await this.getSkillTableMap().toPromise();
    await this.ioService.fetch<CharacterDataModel[]>('getCharacterList', {});

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
    await this.initMyCharacterTableModel();
  }

  async initMyCharacterTableModel() {
    this.myCharacterTableModel = await this.ioService.fetch<CharacterDataModel[]>('getCharacterList', {});
    this.myCharacterTableModel.map((char) => {
      return this.profileCharacterDataModel(char);
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

  getSkillTableMap(): Observable<any> {
    return this.httpClient.get('assets/data/skill_table.json').pipe(map((result: any) => {
      this.skillTableMap = result;
      return result;
    }));
  }

  getMyCharacterListMap(): Observable<CharacterDataModel[]> {
    return this.httpClient.get('assets/data/character_data.json').pipe(map((result: CharacterDataModel[]) => {
      return result;
    }));
  }

  /**
   * 获取头像地址
   * @param code 干员编码
   * @param phase 精英化
   * @returns 头像地址
   */
  getAvatarUrl(code: string, phase: number = 0): string {
    const phaseSkins = this.characterAvatarMap.buildinEvolveMap[code];
    const skinKey = this.characterAvatarMap.map[phaseSkins[phase]];
    if (skinKey) {
      return skinKey;
    } else {
      return this.characterAvatarMap.map[phaseSkins['0']] || '';
    }
  }

  /**
   * 获取当前最大等级
   * @param code 干员编码
   * @param phase 精英化
   * @returns 当前最大等级
   */
  getMaxLevel(code: string, phase: number = 0): number {
    const char = this.characterTableMap[code];
    return char.phases[phase].maxLevel;
  }

  /**
   * 获取最大能精英化的阶段
   * @param code 干员编码
   * @returns 最大能精英化的阶段
   */
  getMaxPhases(code: string) {
    const char = this.characterTableMap[code];
    return char.phases.length - 1;
  }

  getSkills(code: string, phase: number = 0, level: number = 1): Array<{
    skillId: string,
    imgUrl: string,
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
  }> {
    // 获取当前技能
    const allSkills = this.characterTableMap[code];
    return allSkills.skills.filter((skill) => {
      (skill as any).imgUrl = `assets/data/skills/skill_icon_${skill.skillId}.png`;
      return phase >= skill.unlockCond.phase && level >= skill.unlockCond.level;
    }) as any;
  }

  /**
   * 填充干员数据
   */
  profileCharacterDataModel(char: CharacterDataModel): CharacterDataModel {
    const characterTable = this.allCharacterTableModel.find((_char) => _char.code === char.code);
    // 初始化头像
    char.avatar = characterTable.avatar = this.getAvatarUrl(char.code, char.phase);
    // 干员职业
    char.profession = this.characterTableMap[char.code].profession;
    // 获取当前技能
    const skills = this.getSkills(char.code, char.phase, char.level);
    char.skills = skills.map((skill: any) => {
      const dataSkill: CharacterSkillModel = {...skill};
      dataSkill.name = this.skillTableMap[dataSkill.skillId].levels[0].name;
      const origin = char.skills.find((_skill) => _skill.skillId === dataSkill.skillId);
      dataSkill.level = origin? origin.level : 0;
      return dataSkill;
    });
    // 用户头像
    if (typeof char.creator === 'object' && environment.frontHost) {
      char.creator.avatar = `${environment.frontHost}${char.creator.avatar}`;
    }
    return char;
  }
}
