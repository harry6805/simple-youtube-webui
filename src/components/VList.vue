<template>
<div class="container">
    
    <div class="row my-3" v-for="video in video_list">
        <div class="col-md-6">
            <div class="card mb-4">
                <a href="" @click.prevent="toPlay(video.videoId)">
                    <img class="card-img-top" alt="Video" :src="video.thumbnails.medium">
                </a>
                <div class="card-body">
                    <a href="" style="text-decoration:none;" calss="text-decoration-none" @click.prevent="toPlay(video.videoId)">
                        <h5 class="card-title">{{ video.videoTitle }}</h5>
                    </a>
                    <div class="row my-2" v-if="channelsLoaded">
                        <div class="col-1" @click="toChannel(channels[video.videoId].channelId, channels[video.videoId].thumbnails.default)">
                            <img height="32px" width="32px" class="rounded-circle" :src="channels[video.videoId].thumbnails.default" alt="Channel Thumb">
                        </div>
                        <div class="col-3" @click="toChannel(channels[video.videoId].channelId, channels[video.videoId].thumbnails.default)">
                            <p class="card-text">{{ channels[video.videoId].channelTitle }}</p>
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-md-4" v-if="hasPlaybackPosition(video.videoId)">
                            <button type="button" class="btn btn-outline-primary" @click="toPlay">
                                Resume
                            </button>
                        </div>
                        <div class="col-md-4">
                            <button type="button" class="btn btn-outline-primary">
                                Subscribe
                            </button>
                        </div>
                        <div class="col-md-4">
                            <button type="button" class="btn btn-outline-info" >
                                Add to Favorites
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
    
<style>
</style>
    
<script>
    import YoutubeApi from '@/api/YoutubeApi.js';
    import VideoApi from '@/api/VideoApi.js';

    export default {
        name: "VList",

        props: ["video_list"],

        data() {
            return {
                channelsLoaded: false,
                channels: [],
                added_to_favorite: false,
                playbackPositions: {},
            }
        },

        watch: {
            video_list: {
                handler(newVal, oldVal) {
                    this.channelsLoaded = false;
                    this.channels = {};
                    newVal.forEach(v => {
                        this.getChannel(v.videoId, v.channelId);
                        this.checkVideoInfo(1, v.videoId);
                    });
                },
                immediate: true,
            },
        },

        computed: {
            resumeAt: function(video_id) {
                let hours = Math.round(this.playbackPositions[video_id]/3600);
                let minutes = Math.round(Math.round(this.playbackPositions[video_id]%3600)/60);
                let seconds = Math.round(this.playbackPositions[video_id]%60);
                return `${hours}:${minutes}:${seconds}`;
            },
            

        },

        methods: {
            hasPlaybackPosition(video_id){
                return this.playbackPositions.hasOwnProperty(video_id);
            },

            getChannel(videoId, channelId){
                YoutubeApi.getChannel(channelId)
                    .then(res => {
                        this.channels[videoId] = res.data.channel;
                        if(this.video_list.length > 0 && this.video_list.length <= Object.keys(this.channels).length){
                            this.channelsLoaded = true;
                        }
                    }).catch(err => {
                        console.error(`Failed to search videos:`, err);
                    });
            },

            toChannel(channelId, thumb){
                this.$router.push({
                    path: "/channelcontent",
                    query: {
                        c: channelId,
                        thumb: thumb
                    }
                });
            },

            toPlay(videoId){
                this.$router.push({
                    path: "/play",
                    query: {
                        v: videoId,
                        t: this.playbackPosition
                    }
                });
            },

            checkVideoInfo(user_id, video_id){
                VideoApi.getUserVideo(user_id)
                    .then(res => {
                            res.data.forEach(v => {
                                if(v.videoId === video_id){
                                    this.added_to_favorite = v.favored;
                                    this.playbackPositions[video_id] = v.resumeAt;
                                    return;
                                }
                            });
                    }).catch(err => {
                            console.error(`Failed to get favorite videos: `, err);
                    });

                this.added_to_favorite = false;
            },
        }
    }
</script>
    
