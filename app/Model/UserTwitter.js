'use strict'

const Lucid = use('Lucid')

class UserTwitter extends Lucid {

  static get table () {
    return 'users_twitter'
  }

  feed () {
    return this.hasMany('App/Model/TwitterFeed', 'id', 'user_id')
  }
}

module.exports = UserTwitter
