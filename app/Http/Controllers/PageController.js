'use strict'

const alchemyapi = use('Alchemyapi')
const UserTwitter = use('App/Model/UserTwitter')
const UserFacebook = use('App/Model/UserFacebook')
const Database = use('Database')


class PageController {
  * index (request, response) {

    const twitterAccessToken = yield request.session.get( 'twitterAccessToken' )
    const user = yield UserTwitter.findBy( 'access_token', twitterAccessToken )

    yield response.sendView( 'welcome', {twitterFeed : user} )
  }

  * analyze (request, response) {
    
      
        
    const titterAccessToken = yield request.session.get( 'twitterAccessToken' )
    const twitterUser = yield UserTwitter.findBy( 'access_token', twitterAccessToken )
    // var myText = "TIL Welcome to the Alfresco App Dev Framework 1.0.0 LA release https://t.co/2Ce7G9j7Wl via @FrkCorti #projects https://t.co/W35Gj2cAnu";
    

    alchemyapi.sentiment("text", myText, {}, function(res) {
        //console.log("Sentiment: " + JSON.stringify(res["docSentiment"]));
     })
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
