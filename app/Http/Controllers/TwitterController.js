'use strict'

const Config = use('Config')
var Twitter = require('twitter')
var twitterAPI = require('node-twitter-api')
var co = require('co')
const promisify = require("es6-promisify")


const twitter = new twitterAPI({
          consumerKey: Config.get('auth.twitterAuth.consumerKey'),
          consumerSecret: Config.get('auth.twitterAuth.consumerSecret'),
          callback: Config.get('auth.twitterAuth.callbackURL')
      });

class TwitterController {

  * index (request, response) {
      var client = new Twitter({
        consumer_key: Config.get('auth.twitterAuth.consumerKey'),
        consumer_secret: Config.get('auth.twitterAuth.consumerSecret'),
        access_token_key: Config.get('auth.twitterAuth.accessTokenKey'),
        access_token_secret: Config.get('auth.twitterAuth.accessTokenSecret')
      });

      var tweets;

      var params = {screen_name: 'nodejs'};
      client.get('statuses/user_timeline', params, function(error, tweets, res) {
        if (!error) {
          tweets = tweets
        }
        response.json(tweets)
      });
  }

  * connect (request, response) {

    const getToken = promisify(twitter.getRequestToken.bind(twitter), {multiArgs: true})

    getToken().then(function (result) {
        yield request.session.put({'requestToken' : result[0], 'requestTokenSecret' : result[1]})
    });

      /*let x = yield [1,2,3];
      console.log(x)*/
     /* twitter.getRequestToken(
        co(function *(error, requestToken, requestTokenSecret, results){

          //console.log(results);

            //store token and tokenSecret somewhere, you'll need them later; redirect user
            //yield request.session.put('requestToken', requestToken)
            //response.send("https://twitter.com/oauth/authenticate?oauth_token=" + requestToken)
        }).then(function (val) {
          console.log(2);
          console.log(val)
        }, function (err) {
          console.log(3);
          console.error(err.stack);
        })
      );*/

      /*co(function* () {

        //yield request.session.put({'requestToken' : requestToken, 'requestTokenSecret' : requestTokenSecret})
        twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results){
          yield request.session.put({'requestToken' : 1})
        })
      }).then(function (error, requestToken, requestTokenSecret, results) {
        console.log(results)
        //response.send('https://twitter.com/oauth/authenticate?oauth_token='+val.requestToken)
      }, function (err) {
        console.error(err.stack);
      });*/



  }

  * callback (request, response) {

      const requestToken =  yield request.session.get('requestToken')
      const requestTokenSecret =  yield request.session.get('requestTokenSecret')
      const oauth_verifier = request.param('oauth_verifier')

      console.log('requestToken : ' + requestToken)

      twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
          if (error) {
              console.log(error);
          } else {
            console.log(results)
              //store accessToken and accessTokenSecret somewhere (associated to the user)
              //Step 4: Verify Credentials belongs here
          }
      });
  }

}

module.exports = TwitterController
