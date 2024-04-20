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

    <div class="row my-3" v-for="channel in filteredChannels">
        <div class="col-md-2">
            <a href="" @click.prevent="toChannel(channel.channel.channelId, channel.channel.thumbnails.default)">
                <img alt="Channel" :src="channel.channel.thumbnails.default">
            </a>
        </div>
        <div class="col-md-2">
            <div class="row">
                <h1 @click.prevent="toChannel(channel.channel.channelId, channel.channel.thumbnails.default)">{{ channel.channel.channelTitle }}</h1>
                <p>{{ channel.channel.subscriberCount }} subscribers <i>‧</i> {{ channel.channel.videoCount }} videos </p>
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
    import Header from '@/components/Header.vue';
    
    export default {
        name:"Subscribes",
        data() {
            return {
                channels: [],
                channelIds: [],
                channelLoaded: false,
                filteredChannels: [],
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
            this.getChannelIds(1);
        },
    
        components: {
            Header
        },
    
        methods: {
            changeInput(){
                this.isFocus = true;
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

            changeInput(){
                this.isFocus = true;
            },
    
            clearSearchValue (){
                if (this.searchText) {
                    this.searchText = "";
                    this.filteredChannels = [];
                    this.$refs.searchInput.focus();
                }
            },
    
            handleSearch() {
                if (this.searchText.trim()){
                    this.filteredChannels = []; 
                    this.channels.forEach(c => {
                        if(c.channel.channelTitle.trim().toUpperCase().includes(this.searchText.trim().toUpperCase())){
                            this.filteredChannels.push(c);
                        }
                    });
                } else {
                    this.$refs.searchInput.focus();
                    this.filteredChannels = this.channels;
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
    
            getChannelIds(user_id){
                VideoApi.getSubscribes(user_id)
                  .then((response) => {
                    response.data.forEach(c => {
                        this.channelIds.push(c.channelId);
                        this.getChannels(c.channelId);
                    });
                  })
                  .catch((error) => {
                    console.error("Error fetching video list:", error);
                  });
            },

            getChannels(channel_id){
                YoutubeApi.getChannel(channel_id)
                  .then((response) => {
                    this.channels.push(response.data);
                    this.filteredChannels.push(response.data);
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
    
