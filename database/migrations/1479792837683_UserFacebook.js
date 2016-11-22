'use strict'

const Schema = use('Schema')

class UserFacebookTableSchema extends Schema {

  up () {
    this.create('users_facebook', (table) => {
      table.increments()
      table.text('user_id')
      table.string('screen_name')
      table.string('access_token')
      table.string('access_token_secret')
      table.timestamps()
    })
  }

  down () {
    this.table('user_facebook', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = UserFacebookTableSchema
