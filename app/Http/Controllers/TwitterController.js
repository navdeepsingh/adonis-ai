'use strict'

const Config = use('Config')
var twitterAPI = require('node-twitter-api')
const promisify = require("es6-promisify")
const UserTwitter = use('App/Model/UserTwitter')
const Database = use('Database')
const moment = use('moment')

const twitter = new twitterAPI({
          consumerKey: Config.get('auth.twitterAuth.consumerKey'),
          consumerSecret: Config.get('auth.twitterAuth.consumerSecret'),
          callback: Config.get('auth.twitterAuth.callbackURL')
      });

class TwitterController {

  * connect (request, response) {

    const getToken = promisify( twitter.getRequestToken.bind( twitter ), {multiArgs: true} )
    const result = yield getToken()
    response.send(`http://${request.hostname()}:${process.env.PORT}/api/handle/twitter?c1=${result[0]}&c2=${result[1]}`)

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

    if (typeof(Storage) !== "undefined") {
      console.log('Code for localStorage/sessionStorage.')
    } else {
        console.log('Sorry! No Web Storage support..')
    }

    //localStorage.setItem('twitterAccessToken', user.access_token)
    response.send(user.toJSON())

    //response.redirect(`http://${request.hostname()}:${process.env.FRONT_PORT}/`)
  }

  * pullFeed (request, response) {

	const twitterAccessToken = yield request.session.get('twitterAccessToken')
	const user = yield UserTwitter.findBy( 'access_token', twitterAccessToken )
    console.log(user.id)

	const getTimeline = promisify( twitter.getTimeline.bind( twitter ), {multiArgs: true} )
	const result = yield getTimeline("home_timeline", '', user.access_token, user.access_token_secret)

	yield Database.table('twitter_feed').where('user_id', user.id).delete()

	for(let obj of result[0]) {
	   let createdAt = moment(obj.created_at).format('YYYY-MM-DD hh:mm:ss')
	   yield Database.insert([{user_id : user.id, feed : obj.text, created_at : createdAt }]).into('twitter_feed')
	}

    yield request.session.put('twitterPulled', true)
    response.ok()

    }

}

module.exports = TwitterController
