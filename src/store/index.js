import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    namespace: true,
    state: {
        todo: []
    },
    mutations: {
        setTodo(state, payload){
            return state.todo = [...payload]
        }
    },
    getters: {
        // getTodo(state){
        //     return state.todo
        // }
        getTodo: state => value => {
            return state.todo.filter(q => q.todo.toLowerCase().includes(value))
        },
    },
    actions: {
        setTodo({commit}, payload){
            commit('setTodo', payload)
        }
    }
});

export default store