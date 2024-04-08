<template>
    <div class="container">
        <h1 class="mb-4">Search Result</h1>
        <form class="form-inline my-2 my-lg-0 d-flex my-3">
            <input class="form-control mr-sm-2 mx-2" v-model="searchBoxStr" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success mx-2 my-2 my-sm-0" type="submit" @click.prevent="handleSearch">Search</button>
        </form>
        
        <div class="row my-3" v-for="video in videos">
            <div class="col-md-6">
                <div class="card mb-4">
                    <a href="" @click.prevent="toPlay(video.videoId)">
                        <img class="card-img-top" alt="Video" :src="video.thumbnails.medium">
                    </a>
                    <div class="card-body">
                        <a href="" style="text-decoration:none;" calss="text-decoration-none" @click.prevent="toPlay(video.videoId)">
                            <h5 class="card-title">{{ video.title }}</h5>
                        </a>
                        <div class="row my-2" v-if="channelsLoaded">
                            <div class="col-1">
                                <img height="32px" width="32px" class="rounded-circle" :src="channels[video.videoId].thumbnails.default" alt="Channel Thumb">
                            </div>
                            <div class="col-3">
                                <p class="card-text">{{ channels[video.videoId].channelTitle }}</p>
                            </div>
                        </div>
                        <div class="row my-2">
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

    export default {
        name: "SearchVideo",

        data(){
            return {
                videos : [],
                channels: {},
                channelsLoaded: false,
                searchBoxStr: this.$route.query.q
            };
        },

        created(){
            this.searchVideo(this.$route.query.q);
        },

        watch: {
            videos: {
                handler(newVal, oldVal) {
                    newVal.forEach(v => {
                        this.getChannel(v.videoId, v.channelId);
                    });
                },
                immediate: true,
            },
        },

        methods:{
            toPlay(videoId){
                this.$router.push({
                    path: "/play",
                    query: {
                        v: videoId
                    }
                });
            },

            handleSearch(){
                this.videos = [];
                this.channels = {};
                this.channelsLoaded = false;
                this.searchVideo(this.searchBoxStr);
            },

            searchVideo(query){
                YoutubeApi.searchByStr(query)
                    .then(res => {
                        this.videos = res.data.items;
                    }).catch(err => {
                        console.error(`Failed to search videos:`, err);
                    });
            },

            getChannel(videoId, channelId){
                YoutubeApi.getChannel(channelId)
                    .then(res => {
                        this.channels[videoId] = res.data.channel;
                        if(this.videos.length > 0 && this.videos.length <= Object.keys(this.channels).length){
                            this.channelsLoaded = true;
                        }
                    }).catch(err => {
                        console.error(`Failed to search videos:`, err);
                    });
            }
        },
    };
</script>