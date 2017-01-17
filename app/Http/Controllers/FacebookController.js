'use strict'

const UserFacebook = use('App/Model/UserFacebook')
const Database = use('Database')
const moment = use('moment')

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

    response.send(user.toJSON())
  }

  * saveFeed (request, response) {

    const res = request.all()

    const facebookAccessToken = yield request.session.get( 'facebookAccessToken' )
    const user = yield UserFacebook.findBy( 'access_token', facebookAccessToken )

	yield Database.table('facebook_feed').where('user_id', user.id).delete()

    let index = 0
	while(index < res.data.length) {
	    let obj = res.data[index]
    	let createdAt = moment(obj.created_time).format('YYYY-MM-DD hh:mm:ss')
	   	if (typeof obj.message != 'undefined') {
	    	yield Database.insert({user_id : user.id, feed : obj.message, created_at : createdAt}).into('facebook_feed')
    	}
	   	index++
    }

    yield request.session.put('facebookPulled', true)
	
    response.ok()
  }
 

}

module.exports = FacebookController
