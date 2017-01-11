// register modal component
Vue.component('modal', {
   template: '#bs-modal',
   data: function () {
      console.log("### DATA");
   },
})

new Vue({
  el: '#app',

  data: {
    statusLinking : 'Yet to Link',
    statusPulling : 'Yet to Pull',
    statusAnalyzing : 'Yet to Start',
    connectedTwitter : false,
    connectedFacebook : false,
    pulledTwitter : false,
    pulledFacebook : false,
    completeAnalyzing : false,
    showStep2 : false,
    showStep3 : false,
    showResultsLink : true,
    showModal: false,
    function() {
        return {
            columns : [{
                'type' : 'string',
                'label': 'Year'
            }],
            rows : [
                ['2004', 1000, 400],
                ['2005', 1170, 460]
            ],
            options: {
                title: 'Company Performance',
                hAxis: {
                    title: 'Year',
                    minValue: '2004',
                    maxValue: '2007'
                },
                vAxis: {
                    title: '',
                    minValue: 300,
                    maxValue: 1200
                },
                // not setting fixed width
                height: 500
            }
        }
    }
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
        this.fetchStatus()
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
//              console.log(data)
		that.fetchStatus()              
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
      var that = this
      FB.getLoginStatus(function(response) {
        console.log(response.status)
        if ( response.status === 'connected' ) {

          var uid = response.authResponse.userID;
          var accessToken = response.authResponse.accessToken;

          FB.api('/me/feed', {access_token : accessToken}, function(response) {
            if (!response || response.error) {
              console.log(response.error)
            } else {
              console.log(response.data)
              that.$http.post('/api/feed/facebook', {
  			    data : response.data
  		      }).then((data, status, request) => {
			    that.fetchStatus()
		      }, (response) => {
			
		      })
            }
          });

        }
      })

    },

    startAnalyzing: function() {
        console.log('Start API here')
        this.statusAnalyzing = 'Analyzing..'
        this.$http.get('/analyze').then((response) => {
            const result = response.body            
            console.log(result)
            if (result == 'ok') {
                this.showResultsLink = true
                this.statusAnalyzing = result
            }          
        }).catch((error) => {
            this.statusAnalyzing = `Error : ${error}`
            console.log(error)
        });       
    },

    showResults: function() {
        console.log('Modal will be displayed')
//        this.showModal = true
//        const myModal = document.getElementById('myModal')
//        myModal.modal('show')
    },

    fetchStatus: function () {
      this.$http.get('/fetch/status')
        .then((response) => {
          console.log(response.body)
          this.connectedTwitter = response.body.connectedTwitter
          this.connectedFacebook = response.body.connectedFacebook
          this.pulledTwitter = response.body.pulledTwitter
          this.pulledFacebook = response.body.pulledFacebook
          this.statusLinking = ''
          this.statusPulling = ''
    	  if ( this.connectedTwitter == true && this.connectedFacebook == true ) {
        	this.showStep2 = true
    	  }
          if ( this.pulledTwitter == true && this.pulledFacebook == true ) {
            this.showStep3 = true
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  },

  mounted : function() {
    this.fetchStatus()
    that = this
    $('#myModal').on('shown.bs.modal',function(event){
       console.log('displayed modal')
       var modal = $(this);
       var canvas = modal.find('.modal-body canvas');
//    modal.find('.modal-title').html(title);
       var ctx = canvas[0].getContext("2d");    
       let analysisData = []
       let labelsData = []
       let negativeData = []
       let positiveData = []
       let neutralData = []
       that.$http.get('/results').then((response) => {
            const results = response.body            
            let index = 1
            for (let feed in results) {
                let analysis = JSON.parse(results[feed].analysis)
                if (analysis != null) {
                    if (analysis.type == 'neutral') {
                        analysisData.push(0)
                    } else {
                        analysisData.push(analysis.score)
                    }

                    if (analysis.score < 0) {
                        negativeData.push(analysis.score)                        
                    } else if (analysis.score > 0) {
                        positiveData.push(analysis.score)                        
                    } else {
                        neutralData.push(analysis.score)
                    }

                    labelsData.push(index)
                    index++
                }
            }        

       labelsData = labelsData.slice(0, Math.max(positiveData.length, negativeData.length) )
        console.log(labelsData)

       var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labelsData,
                datasets: [{
                 label: 'Negative Tweets',           
                 data: negativeData,
                 backgroundColor: "rgba(31,119,190,1)"
               }, {
                 label: 'Positive Tweets',
                 data : positiveData,
                 backgroundColor: "rgba(44,160,44,1)"                                    
               }]
            },
            options: {               
                  scales: {
                      yAxes: [{
                             ticks: {
                                beginAtZero:true
                             }        
                         }]
                  },
                 title: {
                         display: true,
                         text: 'Twitter Sentiment'
                 }
              }
        });

        

       }).catch((error) => {
            this.statusAnalyzing = `Error : ${error}`
            console.log(error)
       });
     
    })
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
