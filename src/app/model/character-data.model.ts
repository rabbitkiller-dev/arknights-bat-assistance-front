export interface CharacterDataModel {
  code: string; // 代号
  level: number; // 等级
  phase: number; // 精英化

  avatar?: string; // 头图
  skills?: CharacterSkillModel[]
}
export interface CharacterSkillModel {
  skillId?: string; // 技能id
  level: number;
}
