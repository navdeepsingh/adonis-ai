new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!',
    twitterFeed : 'Yet to load'
  },
  methods: {
    linkTwitter: function () {
      this.twitterFeed = 'Loading..'
      this.$http.get('/api/connect/twitter').then((response) => {
        // success callback
        this.twitterFeed = 'Redirecting..'
        window.location = response.body
      }, (response) => {
        // error callback
        this.twitterFeed = 'Error'
      });
    },
    linkFacebook: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
