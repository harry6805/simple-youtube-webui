import request from '@/utils/request';

export default class VideoApi{
    static getList(params={}){
        return request({
            method: 'GET',
            url: "/yt/videoList",//import.meta.env.VITE_VIDEO_LIST_PATH,
            params,
        });
    };

    static getStreamData(video_id){
        return request({
            method: 'GET',
            url: "/yt/directurl/all",//import.meta.env.VITE_VIDEO_LIST_PATH,
            params:{"vid": video_id},
        });
    };

    static getChannel(channel_id){
        return request({
            method: 'GET',
            url: "/yt/channel",//import.meta.env.VITE_VIDEO_LIST_PATH,
            params:{"channelId": channel_id},   
        });
    }

    static addToFavorite(video){
        return request({
            method: 'POST',
            url: "/userdata/videos/add",
            data: video
        });
    }

    static getUserVideo(user_id){
        return request({
            method: 'GET',
            url: "userdata/videos/all",
            params:{"userId": user_id}
        });
    }

    static deleteFavorite(user_id, video_id){
        return request({
            method: 'DELETE',
            url: "userdata/videos/delete",
            params:{"userId": user_id, "videoId": video_id}
        });
    }

    static updateFavorite(video){
        return request({
            method: 'POST',
            url: "/userdata/videos/update_favorite",
            data: video
        });
    }

    static updatePlayback(video){
        return request({
            method: 'POST',
            url: "/userdata/videos/update_playback",
            data: video
        });
    }

    static subscribe(channel){
        return request({
            method: 'POST',
            url: "/userdata/subscribe/add",
            data: channel
        });
    }

    static getSubscribes(user_id){
        return request({
            method: 'GET',
            url: "userdata/subscribe/all",
            params:{"userId": user_id}
        });
    }

    static unsubscribe(user_id, channel_id){
        return request({
            method: 'DELETE',
            url: "userdata/subscribe/delete",
            params:{"userId": user_id, "channelId": channel_id}
        });
    }
};