var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link
/*var transparentBg = require('../styles').transparentBg;*/
var MainContainer = require('./MainContainer');

function Home () {
  return (
    <MainContainer>
      <h1>App using AdonisJS - ReactJS - AlchemyAPI</h1>
      <p className='lead'>Using Artificial Intelligence, we are doing symantic analysis of your first twently feeds from twitter and facebook accounts</p>
      <Link to='/stepOne'>
        <button type='button' className='btn btn-lg btn-success'>Get Started</button>
      </Link>
    </MainContainer>
  )
}

module.exports = Home;
