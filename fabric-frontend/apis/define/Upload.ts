import { Data } from './Data';
import { ReviewState } from './ReviewState';

export interface UploadHistory {
    id: number;
    subjects: string[];
    real_name: string;
    reviewer_real_name: string;
    source?: string;
    time: string;
    count: number;
    review_state: ReviewState;
    disapprove_reason?: string;
    user: string;
    reviewer: string;
    category: number;
    platform_belong:number; //1为大科学装置数据
}

export namespace UploadHistory {
    export interface Full extends UploadHistory {
        meta_id_list:{
            data_list: Data.SlimMeta[];
            public:boolean;
        }
    }
}
