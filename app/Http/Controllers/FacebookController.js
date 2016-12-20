'use strict'

const UserFacebook = use('App/Model/UserFacebook')

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

  * saveFeed (request, response) {
	const data = request.all()
console.log(data)

  }
 

}

module.exports = FacebookController
