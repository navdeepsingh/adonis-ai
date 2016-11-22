'use strict'

const alchemyapi = use('Alchemyapi')
const UserTwitter = use('App/Model/UserTwitter')
const UserFacebook = use('App/Model/UserFacebook')


class PageController {
  * index (request, response) {

      const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
      const user = yield UserTwitter.findBy( 'access_token', twitterAccessToken )

      yield response.sendView( 'welcome', {twitterFeed : user} )

  }


  * fetchStatus (request, response) {

      const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
      const twitterUser = yield UserTwitter.findBy( 'access_token', twitterAccessToken )

      const facebookAccessToken = yield request.session.get( 'facebookAccessToken' )
      const facebookUser = yield UserFacebook.findBy( 'access_token', facebookAccessToken )

      let socialStatus = {}

      if (twitterUser !== null && facebookUser !== null) {
        socialStatus =  {connectedTwitter : true, connectedFacebook : true}
      }

      if (twitterUser == null && facebookUser == null) {
        socialStatus = {connectedTwitter : false, connectedFacebook : false}
      }

      if (twitterUser !== null && facebookUser == null) {
        socialStatus = {connectedTwitter : true, connectedFacebook : false}
      }

      if (twitterUser == null && facebookUser !== null) {
        socialStatus = {connectedTwitter : false, connectedFacebook : true}
      }

      response.send(socialStatus)

  }
}

module.exports = PageController
