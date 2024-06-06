import { Urls } from '../Urls';
import { JsonApiFetch } from '../Fetch'

export interface CertApply {
    cert_key: string;
    create_time: string;
    id: number;
    leader: string;
    name: string;
    ps_id: string;
    state: number;
}

interface Data {
    page_count: number;
    page: number;
    page_size: number;
    data: CertApply[];
}
export async function AssignCertList(page: number, state?: number, page_size: number = 10): Promise<Data> {
    var parameters = "page=" + page + "&pagesize=" + page_size + "&my=0";
    if (state !== -1) {
        parameters = parameters + "&state=" + state;
    }
    const url = `${Urls.api_cert.acceptances_list}?${parameters}`;
    const result = await JsonApiFetch(url);
    return result;
}
