export interface CharacterDataModel {
  code: string; // 代号
  level: number; // 等级
  phase: number; // 精英化
  potentialRank: number; // 潜能
  skills: CharacterSkillModel[]; // 技能

  profession?: string; // 职业
  avatar?: string; // 头图
  creator?: {_id: string, username: string, avatar: string}
}
export interface CharacterSkillModel {
  skillId: string; // 技能id
  level: number;

  name: string; // 技能名称
}
