import {JsonApiFetch} from '../Fetch';
import Urls from '../Urls';

export interface ScoData {
      data: any;
    }

export async function ScoreData(data_ID: number, data_score: number): Promise<ScoData> {
      const score = {score: data_score};
      const result = await JsonApiFetch<ScoData>(Urls.api_v1_storage.data_score(data_ID), 'POST', score);
      return result;
}
