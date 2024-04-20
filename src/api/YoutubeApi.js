import request from '@/utils/request';

export default class YoutubeApi{
    static searchByStr(queryStr){
        return request({
            method: 'GET',
            url: "/yt/search",
            params: {"q": queryStr},
        });
    };

    static searchByChannel(channelId, type){
        return request({
            method: 'GET',
            url: "/yt/search",
            params: {"channelId": channelId, "type":type},
        });
    };

    static getVideoOfPlaylist(playlistId){
        return request({
            method: 'GET',
            url: "/yt/videoList",
            params: {"playlistId": playlistId},
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