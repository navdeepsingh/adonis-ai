'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.integer('twitter_user_id')
      table.string('twitter_screen_name')
      table.string('twitter_access_token')
      table.string('twitter_access_token_secret')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
