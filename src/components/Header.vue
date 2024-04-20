<template>
  <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="home">
                    <img src="@/assets/images/simplified-youtube-logo.png">
                </router-link>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                      <router-link class="nav-link" exact-active-class="active" to="/">Home</router-link>
                    </li>

                    <li class="nav-item">
                      <router-link class="nav-link" to="/continue" exact-active-class="active">Continue to Watch</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link class="nav-link" exact-active-class="active" to="/favorites">Favorites</router-link>
                    </li>
                    <li class="nav-item">
                      <router-link class="nav-link" exact-active-class="active" to="/subscribes">Subscribes</router-link>
                    </li>
                  
                </ul>
                <form class="d-flex">
                  <button v-if="!loggedin" class="btn btn-outline-success" type="button" @click="toLogin">sign in / sign up</button>
                  <a v-else class="">Hello, {{getUsername}} <i class="fa fa-user"></i>
                  </a>
                </form>
              </div>
            </div>
        </nav>

  </div>
</template>

<style scoped>
  nav{
    background-color: rgb(131, 216, 219);
  }

  .nav-link {
    border-radius: 5px;
  }

  .active {
    background-color: aquamarine;
  }
</style>

<script>
  import store from '@/store/index.js';
  import router from '@/router';

  export default {
    name: "Header",

    data(){
      return {
        activeIndex : 1,
      };
    },

    methods:{
        toLogin(){
            router.push('/login')
        }
    },

    computed: {
      loggedin(){
        return store.state.Authorization ? true : false;
      },
      getUsername(){
        return store.state.username;
      }

    }
  };
</script>