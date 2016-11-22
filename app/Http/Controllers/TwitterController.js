  'use strict'

const Config = use('Config')
var twitterAPI = require('node-twitter-api')
const promisify = require("es6-promisify")
const UserTwitter = use('App/Model/UserTwitter')

const twitter = new twitterAPI({
          consumerKey: Config.get('auth.twitterAuth.consumerKey'),
          consumerSecret: Config.get('auth.twitterAuth.consumerSecret'),
          callback: Config.get('auth.twitterAuth.callbackURL')
      });

class TwitterController {

  * connect (request, response) {

    const getToken = promisify( twitter.getRequestToken.bind( twitter ), {multiArgs: true} )
    const result = yield getToken()
    response.send(`/api/handle/twitter?c1=${result[0]}&c2=${result[1]}`)

  }

  * handle (request, response) {

      const data = request.get()

      yield request.session.put('requestToken', data.c1)
      yield request.session.put('requestTokenSecret', data.c2)

      response.redirect(`https://twitter.com/oauth/authenticate?oauth_token=${data.c1}`)

  }

  * callback (request, response) {

      const data = request.get()
      const requestToken =  yield request.session.get('requestToken')
      const requestTokenSecret =  yield request.session.get('requestTokenSecret')
      const oauth_verifier = data.oauth_verifier

      const getAccessToken = promisify( twitter.getAccessToken.bind( twitter ), {multiArgs: true} )
      const result = yield getAccessToken(requestToken, requestTokenSecret, oauth_verifier)


      let user = yield UserTwitter.findBy('user_id', result[2].user_id)

      if (user == null) {
        user = new UserTwitter()
      }

      user.user_id = result[2].user_id
      user.screen_name = result[2].screen_name
      user.access_token = result[0]
      user.access_token_secret = result[1]

      yield user.save()
      yield request.session.put('twitterAccessToken', user.access_token)

      response.redirect('/')
  }

  * pullFeed (request, response) {

      const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
      const user = yield UserTwitter.findBy( 'access_token', twitterAccessToken )

      const getTimeline = promisify( twitter.getTimeline.bind( twitter ), {multiArgs: true} )
      const result = yield getTimeline("home_timeline", '', user.access_token, user.access_token_secret)

      response.send(result[0])

    }

}

module.exports = TwitterController
