'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'PageController.index')
Route
  .get('/twitter/feed/:id', 'PageController.twitterFeed')
  .as('twitterFeed')
Route.get('/fetch/status', 'PageController.fetchStatus')

Route.group('socialAuth', function () {
  Route.get('/connect/twitter', 'TwitterController.connect')
  Route.get('/handle/twitter', 'TwitterController.handle')
  Route.get('/callback/twitter', 'TwitterController.callback')
  Route.get('/feed/twitter', 'TwitterController.pullFeed')

  Route.post('/store/facebook', 'FacebookController.store')
  Route.get('/callback/facebook', 'FacebookController.callback')
  Route.post('/feed/facebook', 'FacebookController.saveFeed')
}).prefix('/api')
