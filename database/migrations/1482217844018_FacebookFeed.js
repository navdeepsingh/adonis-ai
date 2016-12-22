'use strict'

const Schema = use('Schema')

class FacebookFeedTableSchema extends Schema {

  up () {
    this.create('facebook_feed', (table) => {
    table.increments()    
	table.integer('user_id').notNullable().unsigned()
	table.foreign('user_id').references('users_facebook.id')
	table.text('feed')
    table.text('analysis')
	table.timestamps()
    })
  }

  down () {
    this.table('facebook_feed', (table) => {
      // opposite of up goes here
    })
  }

}

module.exports = FacebookFeedTableSchema
