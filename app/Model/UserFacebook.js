'use strict'

const Lucid = use('Lucid')

class UserFacebook extends Lucid {

  static get table () {
    return 'users_facebook'
  }

  feeds () {
    return this.hasMany('App/Model/FacebookFeed', 'id', 'user_id')
  }

}

module.exports = UserFacebook
