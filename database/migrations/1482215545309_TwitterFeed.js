'use strict'

const Schema = use('Schema')

class TwitterFeedTableSchema extends Schema {

  up () {
    this.create('twitter_feed', (table) => {
	table.integer('user_id').notNullable().unsigned()
	table.foreign('user_id').references('users_twitter.id')
	table.text('feed')
	table.timestamps()  
    })
  }

  down () {
    this.dropIfExists('twitter_feed')
  }

}

module.exports = TwitterFeedTableSchema
