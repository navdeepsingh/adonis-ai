'use strict'

const Schema = use('Schema')

class UserTwitterTableSchema extends Schema {

  up () {
    this.create('users_twitter', (table) => {
      table.increments()
      table.integer('user_id')
      table.string('screen_name')
      table.string('access_token')
      table.string('access_token_secret')
      table.timestamps()
    })
  }

  down () {
    this.table('users_twitter', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = UserTwitterTableSchema
