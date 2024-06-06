import {Data} from "./Data";
import {UploadHistory} from "./Upload";

export interface Task{
  id: number;

  task_id: string;
  created_at: string;
  state: string;
  result: object;
  progress: number;
  exception: string;
  task_type: string;
}

export namespace Task{
  export interface Full extends Task {
        meta_id_list:{
            data_list:Task[];
        }
    }
}
