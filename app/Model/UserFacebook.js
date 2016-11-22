'use strict'

const Lucid = use('Lucid')

class UserFacebook extends Lucid {

  static get table () {
    return 'users_facebook'
  }

}

module.exports = UserFacebook
