import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

interface Ret {
  results: Array<{
    username: string;
    real_name: string;
  }>
}

export async function SearchUser(keyword: string = ''): Promise<Array<{username: string, real_name: string}>> {
  let url = Urls.api_v1_account.user_list;
  if (keyword !== '') {
    url = `${url}?query=${keyword}`
  }
  const results = await JsonApiFetch<Ret>(url);
  return results.results;
}
