import Urls from '../Urls';
import {JsonApiFetch} from '../Fetch';

export interface HistoryContent {
  time: string;
  content: string;
}

export async function GetHistory(): Promise<HistoryContent[]> {
  return JsonApiFetch(Urls.history_log.get_history);
}
