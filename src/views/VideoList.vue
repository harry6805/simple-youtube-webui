<template>
<div class="container">
    <Header></Header>

    <form class="form-inline my-2 my-lg-0 d-flex my-3">
        <input 
            class="form-control mr-sm-2 mx-2"
            v-model="searchText"
            ref="searchInput"
            @click="changeInput"
            type="search"
            placeholder="Search..."
            aria-label="Search">
        <button class="btn btn-outline-success mx-2 my-2 my-sm-0" type="submit" @click.prevent="handleSearch">Search</button>
    </form>

    <VList :video_list="videos"></VList>
</div>
</template>

<script>
    import VideoApi from '@/api/VideoApi.js';
    import YoutubeApi from '@/api/YoutubeApi.js';
    import Header from '@/components/Header.vue';
    import VList from '@/components/VList.vue';

    export default {
        name:"VideoList",
        data() {
            return {
                videos: [],
                searchText: ""
            }
        },

        mounted(){
            this.getVideoList();
        },

        components: {
            Header, VList
        },

        methods: {
            changeInput(){
                this.isFocus = true;
            },

            handleSearch(){
                YoutubeApi.searchByStr(this.searchText)
                    .then((response) => {
                        this.videos = response.data.items;
                    });
            },

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