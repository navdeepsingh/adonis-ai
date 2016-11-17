'use strict'

const alchemyapi = use('Alchemyapi')
const User = use('App/Model/User')

class PageController {
  * index (request, response) {

      yield response.sendView('welcome')
  }

  * twitterFeed (request, response) {

      const userId = request.param('id')
      console.log(userId)
      const user = yield User.find(userId)

      console.log(user.toJSON())

      yield response.sendView('welcome', { twitterFeed : user.toJSON() })
  }
}

module.exports = PageController
