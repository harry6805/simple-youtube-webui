<template>
<div class="container">
    <Header></Header>

    <h1>{{ playlistTitle }}</h1>
    <p>{{ channelTitle }}</p>

    <VList :video_list="videoList"></VList>
</div>
</template>

<style></style>

<script>
    import YoutubeApi from '@/api/YoutubeApi.js';
    import Header from '@/components/Header.vue';
    import VList from '@/components/VList.vue';

    export default {
        name: "PlayListContent",

        data() {
            return {
                videoList: [],
                playlistTitle: "",
                channelTitle: ""
            }
        },

        components:{
            Header, VList
        },

        mounted(){
            this.getVideosOfPlaylist(this.$route.query.p);
            this.playlistTitle = this.$route.query.title;
        },

        methods: {
            getVideosOfPlaylist(playlistId){
                if(null === playlistId || undefined === playlistId){
                        return;
                }
                YoutubeApi.getVideoOfPlaylist(playlistId)
                    .then((response) => {
                        this.videoList = response.data.videoList;
                        this.channelTitle = this.videoList[0].channelTitle
                    });
            },
        }
    }

</script>