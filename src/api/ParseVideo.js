import request from '@/utils/request';

export default class ParseVideo{
    static getDirectUrl(data){
        return request({
            method: 'POST',
            url: "",
            params,
            data: data,
            headers: {"Content-Type":"application/json"}
        });
    };
}