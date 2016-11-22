'use strict'

const Lucid = use('Lucid')

class UserTwitter extends Lucid {

  static get table () {
    return 'users_twitter'
  }
}

module.exports = UserTwitter
