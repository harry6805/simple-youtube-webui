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

    <VList :video_list="filteredVideos"></VList>
 
</div>
</template>

<style>
</style>

<script>
    import VideoApi from '@/api/VideoApi.js';
    import Header from '@/components/Header.vue';
    import VList from '@/components/VList.vue';

    export default {
        name:"ContinueWatch",
        data() {
            return {
                videos: [],
                filteredVideos: [],
                searchText: "",
                isFocus: false,
            }
        },

        watch: {
            searchText: function(newVal, oldVal){
                this.handleSearch();
            }
        },

        mounted(){
            this.getVideoList(1);
        },

        components: {
            Header, VList
        },

        methods: {
            changeInput(){
                this.isFocus = true;
            },

            clearSearchValue (){
                if (this.searchText) {
                    this.searchText = "";
                    this.filteredVideos = [];
                    this.$refs.searchInput.focus();
                }
            },

            handleSearch() {
                if (this.searchText.trim()){
                    this.filteredVideos = []; 
                    this.videos.forEach(v => {
                        if(v.videoTitle.trim().toUpperCase().includes(this.searchText.trim().toUpperCase())){
                            this.filteredVideos.push(v);
                        }
                    });
                } else {
                    this.$refs.searchInput.focus();
                    this.filteredVideos = this.videos;
                }
            },

            toPlay(video){
                this.$router.push({
                    path: "/play",
                    query: {
                        v: video.videoId
                    }
                });
            },

            getVideoList(user_id){
                VideoApi.getUserVideo(user_id)
                  .then((response) => {
                    //this.videos = response.data;
                    let videoIds = [];
                    response.data.forEach(v => {
                        if(!videoIds.includes(v.videoId)){
                            videoIds.push(v.videoId);
                            let tns = {};
                            if(null != v.thumbnails && v.thumbnails.length > 0){
                                tns = {"medium": JSON.parse(v.thumbnails)[0].url};
                            }
                            let item = {...v, "thumbnails": tns};
                            this.videos.push(item);
                            this.filteredVideos.push(item);
                        }

                    });
                  })
                  .catch((error) => {
                    console.error("Error fetching video list:", error);
                  });
            },
        }
    };
</script>
