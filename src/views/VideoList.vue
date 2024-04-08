<template>
<div class="container">
    <Header></Header>

    <main>
        <div class="video-card" v-for="video in videos">
            <a @click.prevent="toPlay(video)" href="">
                <img :src="video.thumbnails.standard" alt="Video 1" class="video-thumbnail">
                <h2 class="video-title">{{ video.videoTitle }}</h2>
            
            </a>
            <div class="row">
                <div class="col-1 px-2">
                    <a @click.prevent="toChannel(video)" href="">
                        <img :src="getChannelThumb(video.channelId)" alt="channel thumb" class="video-thumbnail rounded-circle">
                    </a>
                </div>
                <div class="col px-3">
                    <a href="">
                        <p class="video-author">{{ video.channelTitle }}</p>
                    </a>
                    <p class="view-count">{{ video.viewCount }} views • uploaded at {{ video.publishedAt }}</p>
                </div>
            </div>
            
        </div>
    </main>

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
    import Header from '@/components/Header.vue';

    export default {
        name:"VideoList",
        data() {
            return {
                videos: [
                    /*{
                        videoId:"8CYcc6Ft3eU",
                        videoTitle: "Relaxing January Coffee Ambience with Soothing Jazz & Ethereal Background Music to Work, Study",
                        thumbnails:{"default":"https://i.ytimg.com/vi/fZDkGjuZKfA/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC2Hz5xLn7MxavGtUlqlbP43rPKHg"},
                        channelTitle:"Cozy Jazz Vibes",
                        
                    }*/
                ],
            }
        },

        mounted(){
            this.getVideoList();
        },

        components: {
            Header
        },

        methods: {

            toPlay(video){
                this.$router.push({
                    path: "/play",
                    query: {
                        v: video.videoId
                    }
                });
            },

            getVideoList(){
                VideoApi.getList()
                  .then((response) => {
                    this.videos = response.data.videoList;
                    
                  })
                  .catch((error) => {
                    console.error("Error fetching video list:", error);
                  });
            },

            getChannelThumb(channel_id){
                VideoApi.getChannel(channel_id).then(channelRes => {
                    console.log(channel_id);
                    console.log(channelRes.data.channel.thumbnails.default);
                    return channelRes.data.channel.thumbnails.default;
                });
            }
        }
    };
</script>