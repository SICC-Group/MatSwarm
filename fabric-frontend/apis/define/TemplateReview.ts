import { ReviewState } from './ReviewState';

export interface TemplatesReview {
    id: number;
    avg_score:number;
    real_name: string;
    reviewer_real_name: string;
    title: string;
    abstract: string;
    pub_date: string;
    published: boolean;
    review_state: ReviewState;
    content: {};
    disapprove_reason?: string;
    user: string;
    reviewer: string;
    category: number;
    data_count: number;
}