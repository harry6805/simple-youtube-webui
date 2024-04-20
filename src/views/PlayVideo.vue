<template>
    <div class="container">
        <Header></Header>

        <div class="form-check form-switch" @click="switchTrack">
            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" v-model="audioChecked">
            <label class="form-check-label" for="flexSwitchCheckChecked">Play Audio</label>
        </div>
        <div style="width: 640px; height: 320px;" class="player">
                <video-player 
                    controls
                    class="video-player
                    vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                    @ready="onPlayerReady"
                    @error="onPlayerError"
                    @timeupdate="onTimeUpdate"
                ></video-player>
                <h2 class="video-title">{{ video_details.videoTitle }}</h2>

                <div class="row">
                    <div class="col-1 px-2">
                        <a @click.prevent="toChannel(video_details.channelId)" href="">
                            <img :src="channel_thumb" alt="channel thumb" class="video-thumbnail rounded-circle">
                        </a>
                    </div>
                    <div class="col-9 px-3">
                        <div class="row">
                            <div class="col-3 px-2">
                                <a href="">
                                    <p class="video-author">{{ video_details.author }}</p>
                                </a>
                            </div>
                            <div class="col-1 px-2">
                                <button type="button" class="btn" :class="[{'btn-info':subscribed},{'btn-outline-primary':!subscribed}]" @click="subscribe(1, video_details.channelId)">
                                    {{ subscribed ? "Unsubscribe" : "Subscribe"}}
                                </button>
                            </div>
                        </div>
                        <p class="view-count">{{ video_details.viewCount }} views</p>
                    </div>
                    <div class="col-1 px-3">
                        <button type="button" class="btn " :class="[{'btn-info':added_to_favorite},{'btn-outline-info':!added_to_favorite}]" @click="updateFavorite(1, video_details)">
                            {{ added_to_favorite ? "Delete Favorites" : "Add to Favorites" }}
                        </button>
                    </div>
                </div>
        </div>
    
    </div>
    </template>

<style>
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    background-color: #333;
    color: #fff;
    padding: 10px;
    text-align: center;
}

main {
    margin: 20px auto;
}

.video-card {
    background-color: #fff;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.player {
    background-color: #fff;
    margin: 40px auto;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.video-thumbnail {
    width: 100%;
    height: auto;
    border-radius: 5px;
}

.video-title {
    margin: 10px 0;
    font-size: 1.2em;
}

.video-author {
    color: #666;
}
</style>

<script>
    import VideoApi from '@/api/VideoApi.js';
    import { videoPlayer } from 'vue-video-player';
    import 'video.js/dist/video-js.css';
    //import 'vue-video-player/src/custom-theme.css';
    import 'video.js/dist/video-js.css'
    import Header from '@/components/Header.vue';

    export default {
        name:"PlayVideo",
        data() {
            return {
                added_to_favorite: true,
                subscribed: true,
                channel_thumb: "",
                video_details: {},
                audioChecked: true,

                video_details: {},
                audio_stream: {},
                video_stream: {},
                audio_video_stream: {},

                playbackPosition: NaN,
                
                playerOptions: {
                    width: "640",
                    height: "320",
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    autoplay: true, 
                    muted: false,
                    loop: false,
                    preload: 'auto',
                    language: 'en',
                    aspectRatio: '16:9',
                    fluid: true,
                    /*sources: [
                        {
                            src: '//path/to/video.mp4',  // 路径
                            type: 'video/mp4'  // 类型
                        }, 
                        {
                            src: '//path/to/video.webm',
                            type: 'video/webm'
                        }
                    ],*/
                    //poster: 'https://i.ytimg.com/vi/AFPLRIdn1pk/sddefault.jpg', //cover image
                    // width: document.documentElement.clientWidth,
                    notSupportedMessage: 'can not play, please try again',
                    controls:true,
                    controlBar: {
                        timeDivider: true,
                        durationDisplay: true,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true  //全屏按钮
                    },
                }
            }
        },

        components:{
            videoPlayer,
            Header
        },

        created(){
            this.checkVideoInfo(1, this.$route.query.v);
        },

        mounted(){
            
        },

        watch: {
            video_details: {
                handler(newVal, oldVal) {
                    this.getChannelThumb(newVal.channelId);
                    this.checkSubscribe(1, newVal.channelId);
                },
                immediate: true
            }
        },

        computed: {
            favoriteClass: function () {
                return {
                    active: this.isActive && !this.error
                }
            }
        },

        methods: {
            switchTrack(){
                
            },

            checkVideoInfo(user_id, video_id){
                VideoApi.getUserVideo(user_id)
                    .then(res => {
                            if(null === res.data || undefined === res.data || res.data.length === 0){
                                this.playbackPosition = 0;
                            } else {
                                res.data.forEach(v => {
                                    if(v.videoId === video_id){
                                        this.added_to_favorite = v.favored;
                                        if(undefined === v.resumeAt || null === v.resumeAt || Number.isNaN(v.resumeAt)){
                                            this.playbackPosition = 0;
                                        } else {
                                            this.playbackPosition = v.resumeAt;
                                        }
                                        console.log(`playbackPosition: ${this.playbackPosition}`);
                                        return;
                                    }
                                });
                            }
                    }).catch(err => {
                            console.error(`Failed to get favorite videos: `, err);
                    });

                this.added_to_favorite = false;
            },

            updateFavorite(user_id, video_details){
                let favorite_video = {
                    "thumbnails": JSON.stringify(video_details.thumbnails),
                    "channelTitle": video_details.author,
                    "channelId": video_details.channelId,
                    "videoId": video_details.videoId,
                    "videoTitle": video_details.videoTitle,
                    "viewCount": video_details.viewCount,
                    "favored": !this.added_to_favorite,
                    "user": {"id": user_id}
                };
                VideoApi.updateFavorite(favorite_video)
                    .then(res => {
                        console.log(`Success to ${this.added_to_favorite ? "delete": "add" } favorite of video ` + res.data.videoId);
                        this.added_to_favorite = !this.added_to_favorite;
                    }).catch(err => {
                        console.error(`Failed to update favorite of video ${video_details.videoId} :`, err);
                    });
            },

            subscribe(user_id, channel_id, channel_title){
                if(this.subscribed){
                    VideoApi.unsubscribe(user_id, channel_id)
                        .then(res => {
                            console.log(`Success to unsubscribe ` + res.data.id);
                            this.subscribed = false;
                        }).catch(err => {
                            console.error(`Failed to unsubscribe ${channel_id}:`, err);
                        });
                } else {
                    let channel = {
                        "channelId": channel_id,
                        "user_id": user_id,
                        "channelTitle": channel_title,
                        "user": {"id": user_id}
                    };

                    VideoApi.subscribe(channel)
                        .then(res => {
                            console.log(`Success to subscribe ` + res.data.id);
                            this.subscribed = true;
                        }).catch(err => {
                            console.error(`Failed to subscribe ${channel_id}:`, err);
                        });
                }
            },

            checkSubscribe(user_id, channel_id){
                VideoApi.getSubscribes(user_id)
                    .then(res => {
                        res.data.forEach(c => {
                            if(c.channelId === channel_id){
                                this.subscribed = true;
                                return;
                            }
                        }); 
                    }).catch(err => {
                        console.error(`Failed to get subscribes of user ${user_id}:`, err);
                    });
                this.subscribed = false;
            },

            loadVideo(player, video_id){
                VideoApi.getStreamData(video_id)
                  .then((response) => {
                    this.video_details = response.data.videoDetails;
                    this.audio_stream = this.convertStreamSrc(response.data.audioOnly);
                    //let video_stream = this.convertStreamSrc(response.data.videoOnly);
                    this.audio_video_stream = this.convertStreamSrc(response.data.audioVideo);

                    if(this.audioChecked){
                        player.src(this.audio_stream[0]);
                    } else {
                        player.src(this.audio_video_stream[0]);
                    }

                    setTimeout(() => {
                        console.log(`set play time to ${this.playbackPosition}`);
                        player.currentTime(this.playbackPosition);
                    }, 3000);
                    
                    //player.options_.poster(this.video_details.thumbnails[0].url);
                    //this.playerOptions = {...this.playerOptions, poster: 'https://i.ytimg.com/vi/AFPLRIdn1pk/sddefault.jpg'}
                  })
                  .catch((error) => {
                    console.error("Error fetching video stream data:", error);
                  });
            },

            convertStreamSrc(stream_data){
                let new_stream_data = [];
                stream_data.forEach(item => {
                    new_stream_data.push({"src":item.url, "type":item.mimeType.split(";")[0]});
                });
                return new_stream_data;
            },

            onPlayerReady(player) {
                //console.log('Player is ready: ', player);
                //player.sources = this.video_stream_audio_video;
                //player.src(this.video_stream_audio_video[0]);
                //player.options.poster = this.video_details.thumbnails[0].url;
                //player.width = this.video_details.thumbnails[0].width;
                //player.height = this.video_details.thumbnails[0].height;
                //this.playerOptions = {...this.playerOptions, poster: 'https://i.ytimg.com/vi/AFPLRIdn1pk/sddefault.jpg'}
                console.log(JSON.stringify(this.playerOptions));
                this.loadVideo(player, this.$route.query.v);
            },

            onPlayerError(player){
                this.loadVideo(player, this.$route.query.v);
            },

            onTimeUpdate(event){
                //console.log(event.currentTime());
                if(event.currentTime() - this.playbackPosition >= 5){
                    this.playbackPosition = event.currentTime();
                    this.updatePlaybackPosition(1, this.video_details, event.currentTime());
                }
            },

            updatePlaybackPosition(user_id, video_details, playback_position){
                let video = {
                    "publishedAt": "",
                    "thumbnails": JSON.stringify(video_details.thumbnails),
                    "channelTitle": video_details.author,
                    "channelId": video_details.channelId,
                    "videoId": video_details.videoId,
                    "videoTitle": video_details.videoTitle,
                    "viewCount": video_details.viewCount,
                    "resumeAt": playback_position,
                    "user": {"id": user_id}
                };

                VideoApi.updatePlayback(video)
                    .then(res => {
                        console.log(`Success to update video ${video_details.videoId}`);
                    }).catch((error) => {
                        console.error(`Error update video ${video_details.videoId}:`, error);
                    });
            },

            getChannelThumb(channel_id){
                VideoApi.getChannel(channel_id).then(channelRes => {
                    //console.log(channel_id);
                    //console.log(channelRes.data.channel.thumbnails.default);
                    this.channel_thumb = channelRes.data.channel.thumbnails.default;
                });
            }
        }
    };
</script>