export const state = () => ({
  success: {},
  error: {},
  errors: {},
  user: null,
})

export const mutations = {
  setSuccess (state, success) {
    state.success = success
  },
  UNSET_USER (state) {
    state.auth.user = null
    state.auth.loggedIn = false
  }
}

export const getters = {
  loggedIn: state => state.auth.user !== null && state.auth.user.player !== null && state.auth.user.player !== false,
  loggedUser: state => state.auth.user !== null ? state.auth.user.player : null
}

export const actions = {
  async nuxtServerInit ({ commit }) {
    try {
    } catch (e) {
      console.log(e)
    }
  },
  handleHttpResponse ({ commit }, response) {
    commit('setSuccess', response)
  }
}
