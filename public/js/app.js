new Vue({
  el: '#app',

  data: {
    statusLinking : 'Yet to Link',
    statusPulling : 'Yet to Pull',
    connectedTwitter : false,
    connectedFacebook : false,
    showStep2 : false
  },

  methods: {
    linkTwitter: function () {
      this.statusLinking = 'Loading..'
      this.$http.get('/api/connect/twitter').then((response) => {
        // success callback
        this.statusLinking = 'Redirecting..'
        window.location = response.body
      }, (response) => {
        // error callback
        this.statusLinking = 'Error'
      });
    },

    pullFeedTwitter: function () {
      this.statusPulling = 'Loading..'
      this.$http.get('/api/feed/twitter').then((response) => {
        // success callback
        console.log(response.body)
        this.statusPulling = 'Pulled'
        //  this.$http.get('/')
      }, (response) => {
        // error callback
        this.statusPulling = 'Error'
      });
    },

    linkFacebook: function () {
      this.statusLinking = 'Loading..'
      var that = this

      FB.getLoginStatus(function(response) {
        console.log(response.status)
        if ( response.status === 'connected' ) {

          var uid = response.authResponse.userID;
          var accessToken = response.authResponse.accessToken;
          that.connectedFacebook = true
          that.statusLinking = ''

          FB.api('/me', {fields: 'name'}, function(response) {
            console.log(response);
            that.$http.post('/api/store/facebook', {
              accessToken :accessToken,
              id : uid,
              name : response.name
            }).then((data, status, request) => {
              console.log(data)
            }, (response) => {
              this.statusPulling = 'Error'
            });
          });

        } else {

          // the user isn't logged in to Facebook.
          FB.login( function(response) {
            if ( response.authResponse ) {
              that.statusLinking = 'Fetching your information..'

              FB.api('/me', function(response) {
                console.log('Good to see you, ' + response.name + '.');
                that.statusLinking = 'Good to see you, ' + response.name + '.'
                that.connectedFacebook = true
                var accessToken = response.authResponse.accessToken;
                console.log(accessToken)
              });

            } else {
              that.statusLinking = 'User cancelled login or did not fully authorize.'
            }
          }, { scope: 'user_posts'});

        }
      });

    },

    pullFeedFacebook: function () {
      FB.getLoginStatus(function(response) {
        console.log(response.status)
        if ( response.status === 'connected' ) {

          var uid = response.authResponse.userID;
          var accessToken = response.authResponse.accessToken;

          FB.api('/me/feed', {access_token : accessToken}, function(response) {
            if (!response || response.error) {
              console.log(response.error)
            } else {
              console.log(response)
            }
          });
        }
      })



    },

    fetchStatus: function () {
      this.$http.get('/fetch/status')
        .then((response) => {
          console.log(response.body)
          this.connectedTwitter = response.body.connectedTwitter
          this.connectedFacebook = response.body.connectedFacebook
          this.statusLinking = ''
	  if ( this.connectedTwitter == true && this.connectedFacebook == true ) {
		this.showStep2 = true
	  }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  },

  mounted : function() {
    this.fetchStatus()
  },

  created: function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '212924785417190',
        xfbml      : true,
        version    : 'v2.7'
      });
   };

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
})
