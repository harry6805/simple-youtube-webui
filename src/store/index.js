import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
        loginTimeStamp: localStorage.getItem('loginTimeStamp') ? localStorage.getItem('loginTimeStamp') : '',
    },
    mutations: {
        changeLogin(state, user){
            state.Authorization = user.Authorization;
            state.username = user.username;
            state.loginTimeStamp = user.loginTimeStamp;
            localStorage.setItem('Authorization', user.Authorization);
            localStorage.setItem('username', user.username);
            localStorage.setItem('loginTimeStamp', new Date().getTime());
        }
    }
});

export default store;