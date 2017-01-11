'use strict'

const alchemyapi = use('Alchemyapi')
const UserTwitter = use('App/Model/UserTwitter')
const UserFacebook = use('App/Model/UserFacebook')
const Database = use('Database')
const promisify = require("es6-promisify")
const moment = use('moment');


class PageController {
  * index (request, response) {

    const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
    const user = yield UserTwitter.findBy( 'access_token', twitterAccessToken )

    yield response.sendView( 'welcome', {twitterFeed : user} )
  }

  * analyze (request, response) { 
              
    const twitterAccessToken = yield request.session.get('twitterAccessToken')
    const twitterUser = yield UserTwitter.findBy( 'access_token', twitterAccessToken )
        
    const facebookAccessToken = yield request.session.get('facebookAccessToken')
    const facebookUser = yield UserFacebook.findBy( 'access_token', facebookAccessToken )

    const twitterFeeds =  yield twitterUser.feeds().fetch()
    const facebookFeeds = yield facebookUser.feeds().fetch()

    const sentiment = promisify( alchemyapi.sentiment.bind( alchemyapi ))   

    const socialFeeds = {"twitter": {"table": "twitter_feed","data": twitterFeeds}, "facebook" : {"table": "facebook_feed", "data" : facebookFeeds}}


    for (let key in socialFeeds) {        
         if (socialFeeds.hasOwnProperty(key)) {
            console.log(socialFeeds[key].table)
            let index = 0
            let feedJson = socialFeeds[key].data.toJSON()
            while( index < feedJson.length ) {
 
              let feed = feedJson[index].feed    

              try {
                  yield sentiment("text", feed, {})      
              } 
              catch(res) {
                  yield Database.table(socialFeeds[key].table)
                  .where('id', feedJson[index].id)
                  .update({'analysis' :  JSON.stringify(res.docSentiment), updated_at : moment().format('YYYY-MM-DD hh:mm:ss')})            
              }
              index++
            }                
         }     
    }
    return response.send('ok')    

  }

  * results (request, response) {
    
    const twitterAccessToken = yield request.session.get('twitterAccessToken')
    const twitterUser = yield UserTwitter.findBy( 'access_token', twitterAccessToken )
  
    const facebookAccessToken = yield request.session.get('facebookAccessToken')
    const facebookUser = yield UserFacebook.findBy( 'access_token', facebookAccessToken )

    const twitterFeeds =  yield twitterUser.feeds().fetch()
    const facebookFeeds = yield facebookUser.feeds().fetch()

    const resultFeeds = twitterFeeds.map((feed) => {
        return feed
    })

    return response.send(resultFeeds)

  }

  * fetchStatus (request, response) {

    const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
    const twitterUser = yield UserTwitter.findBy( 'access_token', twitterAccessToken )

    const facebookAccessToken = yield request.session.get( 'facebookAccessToken' )
    const facebookUser = yield UserFacebook.findBy( 'access_token', facebookAccessToken )

    const twitterPulled = yield request.session.get( 'twitterPulled' )
    const facebookPulled = yield request.session.get( 'facebookPulled' )

    let socialStatus = {}

    if (twitterUser !== null && facebookUser !== null) {
      socialStatus =  {connectedTwitter : true, connectedFacebook : true}
    }

    if (twitterUser == null && facebookUser == null) {
      socialStatus = {connectedTwitter : false, connectedFacebook : false}
    }

    if (twitterUser !== null && facebookUser == null) {
      socialStatus = {connectedTwitter : true, connectedFacebook : false}
    }

    if (twitterUser == null && facebookUser !== null) {
      socialStatus = {connectedTwitter : false, connectedFacebook : true}
    }

    if (twitterPulled == null) {
      socialStatus.pulledTwitter = false     
    } else {
       socialStatus.pulledTwitter = true
    }

    if (facebookPulled == null) {
      socialStatus.pulledFacebook = false
    } else {
      socialStatus.pulledFacebook = true
    }

    response.send(socialStatus)
  }
}

module.exports = PageController
