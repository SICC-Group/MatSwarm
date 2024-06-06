import { Subject } from './Subject';


export interface Project {
    id: string;
    institution: string;
    leader: string;
    leader_contact_method: string;
    name: string;
    responsible_expert: string;
    subjects: Subject[];
}

export interface ProjectAll {
    id: string;    
    name: string;
}
