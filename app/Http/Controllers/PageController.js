'use strict'

const alchemyapi = use('Alchemyapi')

class PageController {
  * index (request, response) {
        yield response.sendView('welcome')
  }
}

module.exports = PageController
