import { Category } from './Category';

export enum UserRole {
  Root = 0,
  Verified = 1,
  TemplateUploader = 2,
  TemplateAdmin = 3,
  DataUploader = 4,
  DataAdmin = 5,  // 
  DOIAdmin = 6,  // 64
  UserAdmin = 7, // 128
}
export enum AcceptanceRole {
  GroupLeader = 0,  // 评价组长
  Expert = 1, // 专家
  ProjectConcludeExpertGroupLeader = 2, // 项目结题专家组长
  ProjectConcludeExpert = 3,  // 项目结题专家
  AcceptanceExpert = 4, // 数据汇交验收专家
  ProjectLeader = 5,  // 项目负责人
  SubjectLeader = 6,  // 课题负责人
  Admin = 7,  // 管理员
  Member = 8,  // 普通成员
}

export interface NotificationS {
  content: string;
  id: number;
  important: boolean;
  timestamp: string;
  unread: boolean;
}

export function RolesToBitwiseNumber(roles: UserRole[]) {
  const all = [0, 0, 0, 0, 0, 0, 0, 0];
  roles.forEach((value) => all[value] = 1);
  return all[7] * 128 + all[6] * 64 + all[5] * 32 + all[4] * 16 + all[3] * 8 + all[2] * 4 + all[1] * 2 + all[0] * 1;
}

export function RoleToMsgID(role: UserRole) {
  switch (role) {
      case UserRole.DOIAdmin: return 'role:doi_admin';
      case UserRole.DataAdmin: return 'role:data_admin';
      case UserRole.DataUploader: return 'role:data_upload';
      case UserRole.TemplateAdmin: return 'role:template_admin';
      case UserRole.TemplateUploader: return 'role:template_upload';
      case UserRole.Root: return 'role:root';
      case UserRole.Verified: return 'role:verified';
      case UserRole.UserAdmin: return 'role:user_admin';
  }
  return 'unknown';
}

export interface UserInfo {
  email: string;
  email_verified: boolean;
  institution: string;
  real_name: string;
  sex: string;
  tel: string;
  username: string;
  roles: UserRole[];
  roles_for_acceptance: AcceptanceRole[];
  notifications: NotificationS[];
  unread_count: number;
  managed_categories: Category.Base[];
}
