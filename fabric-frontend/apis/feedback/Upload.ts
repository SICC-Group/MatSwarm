import {UploadFetch} from "../Fetch";
import Urls from '../Urls';

export async function UploadFn (param:any)  {
    let formData = new FormData()
    formData.append('files[]', param.file)
    UploadFetch(Urls.api_v1_ticketing.upload_image,'POST', formData).then((res) => {
        param.success({
            url: res[0].url,
                meta: {
                    id: res[0].id,
                    title: res[0].name,
                },
        })
        }).catch(() => {
         param.error({
            msg: 'unable to upload.'
        })
    })
}