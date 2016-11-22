'use strict'



const Config = use('Config')
const promisify = require("es6-promisify")
const UserFacebook = use('App/Model/UserFacebook')
const options = {
    client_id: Config.get('auth.facebookAuth.appId'),
    client_secret: Config.get('auth.facebookAuth.appSecret'),
    redirect_uri: Config.get('auth.facebookAuth.callbackUrl'),
    grant_type: 'client_credentials'
}
var FB = require('fb'),
    fb = new FB.Facebook(options);
//const FBPromise  = require('fb-promise-wrapper')



class FacebookController {

  * store (request, response) {

    const data = request.post()
    yield request.session.put('facebookAccessToken', data.accessToken)

    let user = yield UserFacebook.findBy( 'user_id', data.id )

    if (user == null) {
      user = new UserFacebook()
    }

    user.user_id = data.id
    user.screen_name = data.name
    user.access_token = data.accessToken

    yield user.save()

    response.ok()
  }

}

module.exports = FacebookController
