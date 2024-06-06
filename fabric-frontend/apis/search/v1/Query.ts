// import JsonApiFetch from '../../Fetch';
// import Urls from '../../Urls';

// export interface SearchV1Data {
//   page_count: number;
//   page_num: number;
//   result: SearchV1DataResult;
//   total_count: number;
// }
// export interface SearchV1DataResult {
//   abstract: string;
//   add_time: string;
//   approved: boolean;
//   author: string;
//   category: string;
//   category_id: number;
//   contributor: string;
//   doi: string;
//   downloads: number;
//   id: number;
//   institution: string;
//   keywords: string[];
//   methods: string[];
//   project: string;
//   purpose: string;
//   reference: string;
//   reviewer: string;
//   reviewer_ins: string;
//   score: number;
//   source: string;
//   tid: number;
//   title: string;
//   views: number;
// }
// export async function GetSearchV1Data(get_text: string): Promise<SearchV1Data> {
//   const x_data: any = null;
//   const q_data = {meta: x_data, data: x_data, text: get_text };
//   const data_post = {q: q_data };
//   const result = await JsonApiFetch<SearchV1Data>(Urls.api_v1_search.query, 'POST', data_post);
//   return result;
// }

// export async function GetSearchV1Data1(get_text: string): Promise<SearchV1Data> {
//   const x_data: string = null;
//   const meta1 = {field: "title", op: "contains", val: "5" };
//   const q_data = {meta: meta1, data: x_data };
//   const data_post = {q: q_data };
//   const result = await JsonApiFetch<SearchV1Data>(Urls.api_v1_search.query, 'POST', data_post);
//   return result;
// }
