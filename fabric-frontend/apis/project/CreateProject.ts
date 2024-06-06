import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Project } from '../define/Project';

export async function CreateProject( id: string,projects_area:string[], name: string, username:string,
    institution: string,leader_contact_method:string,responsible_expert:string,responsible_expert_institution:string){
    const url =  Urls.api_v1_storage.create_material_projects;
    return JsonApiFetch(url, 'POST', {
        id, projects_area,name, leader:username,institution, leader_contact_method,responsible_expert,responsible_expert_institution
    });
}
