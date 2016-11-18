new Vue({
  el: '#app',

  data: {
    message: 'Hello Vue.js!',
    status : 'Yet to load',
    connectedTwitter : false,
    connectedFacebook : false
  },

  methods: {
    linkTwitter: function () {
      this.status = 'Loading..'
      this.$http.get('/api/connect/twitter').then((response) => {
        // success callback
        this.status = 'Redirecting..'
        window.location = response.body
      }, (response) => {
        // error callback
        this.status = 'Error'
      });
    },

    linkFacebook: function () {
      this.message = this.message.split('').reverse().join('')
    },

    fetchStatus: function () {
      this.$http.get('/fetch/status')
        .then((response) => {
          console.log(response.body)
          this.connectedTwitter = response.body.connectedTwitter
          this.connectedFacebook = response.body.connectedFacebook
          this.status = ''
        }, (error) => {
          console.log(error)
        });
    }
  },

  mounted : function() {
    this.fetchStatus()
  }
})
