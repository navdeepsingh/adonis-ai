'use strict'

const Lucid = use('Lucid')

class TwitterFeed extends Lucid {

    static get table () {
        return 'twitter_feed'
    }

    user () {
        return this.belongsTO('App/Model/UserTwitter')
    }

}

module.exports = TwitterFeed
