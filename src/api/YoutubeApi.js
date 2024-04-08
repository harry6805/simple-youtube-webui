import request from '@/utils/request';

export default class YoutubeApi{
    static searchByStr(queryStr){
        return request({
            method: 'GET',
            url: "/yt/search",
            params: {"q": queryStr},
        });
    };

    static getChannel(channelId){
        return request({
            method: 'GET',
            url: "/yt/channel",
            params: {"channelId": channelId},
        });
    };
};