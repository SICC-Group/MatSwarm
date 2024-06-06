export namespace Data {
  export enum Source {
    SelfProduct = '10', Extract = '01'
  }

  export enum Method {
    Calculation, Experiment, Production, Other,
  }

  export namespace Method {
    export const all = new Set([
      Method.Calculation,
      Method.Experiment,
      Method.Production,
      Method.Other,
    ])
  }

  export interface MetaBase {
    doi: string;
    title: string;
    abstract: string;
    reference: string;
    keywords: string[];
    tid: number;
    project: string;
    subject: string;
    source: Source;
    methods: Set<Data.Method>;

    public_date: number;
    public_range: number|string;
    contributor: string;
    institution: string;
  }

  export type Content = any;

  export interface SlimMeta {
    id: number;
    title: string;
    tid: number;
  }

  export interface Meta extends MetaBase {
    id: number;
    add_time: string;
    downloads: number;
    views: number;
    score: number;
    category_name: string;
    category_id: number;
    contributor: string;
    approved: boolean;
    institution: string;
    reviewer: string;
    review_state: number;
    reviewer_ins: string;
    author: string;
    disapprove_reason: string;
    
    via?: string;
    
  }

  export interface RawMeta {
    abstract: string;
    add_time: string;
    approved: boolean;
    author: string;
    category: string;
    category_id: number;
    contributor: string;
    doi: string;
    downloads: number;
    id: number;
    institution: string;
    keywords: string[];
    methods: string[];
    project: string;
    purpose: string;
    reference: string;
    reviewer: string;
    review_state: number;
    reviewer_ins: string;
    score: number;
    source: string;
    subject: string;
    tid: number;
    title: string;
    via?: string;
    views: number;
    disapprove_reason: string;
    uploader_institution ?: string;
    platform_belong ?: string;

    project_name: string;
    subject_name: string;

    public_date: number;
    public_range: number|string;
  }

  export function fromRawDataMeta(raw: RawMeta): Meta {
    return {
      ...raw,
      source: (raw.source === 'self-production' || raw.source === '10' ? Source.SelfProduct : Source.Extract),
      methods: new Set(raw.methods as any),
      category_name: raw.category,
    }
  }
}
