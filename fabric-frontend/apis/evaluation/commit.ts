import Urls from '../Urls';
import {JsonApiFetch,UploadFetch }from '../Fetch';

export async function CommitEvaluation(acceptance_id:number,evaluations:any,comment:string,signature:any ) {
    const url = Urls.api_cert.upload_evaluation;
    console.log(signature)
    let evaluation = {
        "a": evaluations[0],
        "b": evaluations[1],
        "c":evaluations[2],
        "d":evaluations[3],
        "e":evaluations[4],
        "f":evaluations[5],
    };
    let formData = new FormData();
    formData.append('signature', signature);
    formData.append('comment', comment);
    formData.append('acceptance_id', String(acceptance_id));
    //formData.append('evaluation', JSON.stringify(evaluation));
    formData.append("a",evaluations[0]);
    formData.append("b",evaluations[1]);
    formData.append("c",evaluations[2]);
    formData.append("d",evaluations[3])
    formData.append("e",evaluations[4]);
    formData.append("f",evaluations[5])
    return UploadFetch<number>(url, 'POST', formData,
    // {
    // acceptance_id: acceptance_id,
    // evaluation:{
    //     "a": evaluations[0],
    //     "b": evaluations[1],
    //     "c":evaluations[2],
    //     "d":evaluations[3],
    //     "e":evaluations[4],
    //     "f":evaluations[5],
    // },
    // comment: comment,
    // signature:signature
    // }
    )
}