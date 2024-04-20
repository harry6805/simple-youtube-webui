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

    <div class="row my-3">
        <div class="col-md-2">
            <a href="" @click.prevent="">
                <img alt="Channel" :src="channelThumbnail">
            </a>
        </div>
        <div class="col-md-2">
            <div class="row">
                <h1>{{ channelTitle }}</h1>
            </div>
        </div>
    </div>

    <ul class="nav justify-content-end">
        <li class="nav-item">
            <a class="nav-link active" aria-current="page" @click.prevent="changeType('video')" href="">Videos</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" @click.prevent="changeType('playlist')" href="">Playlists</a>
        </li>
    </ul>

    <h1>{{ type }}</h1>

    <div class="row my-3" v-for="item in items">
        <div class="col-md-2">
            <a href="" @click.prevent="toPlaylistOrPlay(item.videoId, item.playlistId,item.title)">
                <img alt="Items" :src="item.thumbnails.default">
            </a>
        </div>
        <div class="col-md-10">
            <a href="" @click.prevent="toPlaylistOrPlay(item.videoId, item.playlistId,item.title)">
                <h1>{{ item.title }}</h1>
            </a>
        </div>
    </div>
</div>
</template>
    
<style>
</style>
        
<script>
    import YoutubeApi from '@/api/YoutubeApi.js';
    import Header from '@/components/Header.vue';
    
    export default {
        name:"ChannelContent",
        data() {
            return {
                items: [],
                type: "video",
                channelThumbnail: "",
                channelTitle: "",
                videoList: [],
                filteredItems: [],
                searchText: "",
                isFocus: false,
            }
        },
    
        watch: {
            searchText: function(newVal, oldVal){
                this.handleSearch();
            },

            type: function(newVal, oldVal){
                this.searchItems(this.$route.query.c, newVal);
            }
        },
    
        created(){
            this.searchItems(this.$route.query.c, this.type);
            //this.channelTitle = this.$route.query.title;
            this.channelThumbnail = this.$route.query.thumb;
        },
    
        components: {
            Header
        },
    
        methods: {
            toPlaylistOrPlay(videoId, playlistId, title){
                if(null === videoId || undefined === videoId){
                    this.$router.push({
                        path: "/playlist",
                        query: {
                            p: playlistId,
                            title: title
                        }
                    });
                } else {
                    this.$router.push({
                        path: "/play",
                        query: {
                            v: videoId
                        }
                    });
                }
            },

            changeType(type){
                this.type = type;
            },

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
    
            searchItems(channelId, type) {
                YoutubeApi.searchByChannel(channelId, type)
                    .then((response) => {
                        this.items = response.data.items;
                        this.channelTitle = this.items[0].channelTitle;
                    })
            },
 
            getChannels(channel_id){
                YoutubeApi.getChannel(channel_id)
                  .then((response) => {
                    this.channels.push(response.data);
                    if(this.channels.length === this.channelIds.length){
                        this.channelLoaded = true;
                    }
                  })
                  .catch((error) => {
                    console.error(`Error fetching channel[${channel_id}]:`, error);
                  });
            }
        }
    };
</script>
        
    
