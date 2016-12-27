'use strict'

const Lucid = use('Lucid')

class FacebookFeed extends Lucid {

     static get table () {
        return 'facebook_feed'
     }


     user () {
        return this.belongsTO('App/Model/UserFacebook')
     }

}

module.exports = FacebookFeed
