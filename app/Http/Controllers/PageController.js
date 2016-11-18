'use strict'

const alchemyapi = use('Alchemyapi')
const User = use('App/Model/User')


class PageController {
  * index (request, response) {

      const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
      const user = yield User.findBy( 'twitter_access_token', twitterAccessToken )

      yield response.sendView( 'welcome', {twitterFeed : user} )

  }

  * twitterFeed (request, response) {

      const userId = request.param('id')
      const user = yield User.find(userId)

      yield response.sendView( 'welcome', {twitterFeed : user.toJSON()} )

  }

  * fetchStatus (request, response) {

      const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
      const twitterUser = yield User.findBy( 'twitter_access_token', twitterAccessToken )

      if (twitterUser !== null) {
        response.send({connectedTwitter : true, connectedFacebook : false})
      }

  }
}

module.exports = PageController
