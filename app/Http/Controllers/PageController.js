'use strict'

const alchemyapi = use('Alchemyapi')
const UserTwitter = use('App/Model/UserTwitter')
const UserFacebook = use('App/Model/UserFacebook')
const Database = use('Database')
const promisify = require("es6-promisify")
const _ = require("lodash")


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

    const twitterFeed =  yield twitterUser.feed().fetch()
    const twitterFeedJson = twitterFeed.toJSON()
    const twitterFeedValue = twitterFeed.value()

    const facebookFeed = yield facebookUser.feed().fetch()
    const facebookFeedJson = facebookFeed.toJSON()
    
   
    let index = 0
    while( index < twitterFeedJson.length ) {
 
      let feed = twitterFeedJson[index].feed    

      const sentiment = promisify( alchemyapi.sentiment.bind( alchemyapi ))
      try {
          yield sentiment("text", feed, {})      
      } 
      catch(res) {
//        console.log(res.docSentiment)
//        console.log(twitterFeed.value())
//        console.log(_.size(twitterFeed.value()))
        const feedValue = twitterFeedValue[index].attributes

        console.log(feedValue)

//        feedValue.fill({analysis : JSON.stringify(res.docSentiment)})
//        yield feedValue.save()

//      yield twitterUser.feed().save(twitterFeedJson[index])
         

/*      yield Database.table('twitter_feed')
          .where('id', twitterFeedJson[index].id)
          .update('analysis', JSON.stringify(res.docSentiment))*/
            
      }

      index++
    }
   return response.send('ok')    

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
