import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    },
    mutations: {
      clearToken(state) {
        state.token = null;
      },
      setToken(state, token) {
        state.token=token
      },
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost
      }
    },
    actions: {
      authenticateUser(vuexContext, authData) {
          let authUrl= 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[AIzaSyCkSNAYxkEjTD_1rM1w9X0ixelR3A0yqRE]'
          if(!authData.isLogin) {
            authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[AIzaSyCkSNAYxkEjTD_1rM1w9X0ixelR3A0yqRE]'
          }
          return this.$axios.$post(authUrl,
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }).then(result => {
            vuexContext.commit('setToken', result.idToken)
            vuexContext.dispatch("setLogoutTimer", result.expiresIn * 1000);

          })
            .catch(e => console.log(e))
      },
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
          .$get("/posts.json")
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key], id: key });
            }
            vuexContext.commit("setPosts", postsArray);
          })
          .catch(e => context.error(e));
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return this.$axios
          .$post("https://nuxt-blog-bbd17-default-rtdb.firebaseio.com/posts.json?auth=" + vuexContext.state.token, createdPost)
          .then(data => {
            vuexContext.commit('addPost', {...createdPost, id: data.name})
          })
          .catch(e => console.log(e));
      },
      editPost(vuexContext, editedPost) {
        return this.$axios.$put("https://nuxt-blog-bbd17-default-rtdb.firebaseio.com/posts/" +
          editedPost.id +
          ".json?auth=" + vuexContext.state.token, editedPost)
          .then(res => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(e => console.log(e))
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit("setPosts", posts);
      },
      setLogoutTimer(vuexContext, duration) {
        setTimeout(() => {
          vuexContext.commit("clearToken");
        }, duration);
      },
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token =!null
      }
    }
  });
};

export default createStore;
