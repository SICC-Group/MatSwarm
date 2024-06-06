import { UserRole, RolesToBitwiseNumber } from '../define/User';
import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export async function PatchPermission(userID: string, newRoles: UserRole[], categories: number[], ticketID?: number) {
  const num = RolesToBitwiseNumber(newRoles);
  return JsonApiFetch(Urls.api_v1_account.user_permissions(userID), 'PATCH', {
    roles: num, categories: categories, ticket: ticketID
  });
}

