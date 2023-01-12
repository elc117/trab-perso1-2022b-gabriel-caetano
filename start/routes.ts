import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

// Route.get('/test', 'Client/PredictionsController.index')

/* Session routes */
Route.post('register', 'SessionsController.register')
Route.post('sessions', 'SessionsController.create')
Route.post('/sessions/validate', 'SessionsController.validate')

/* Forgot password routes */
Route.post('users/forgot-password', 'ForgotPasswordController.store')
Route.put('users/forgot-password/:token/:email', 'ForgotPasswordController.update')

/* Update user info routes */
Route.group(() => {
  Route.post('sessions/logout', 'SessionsController.destroy') //removes current token from api_tokens table

  Route.put('/users/:id/change-password', 'ChangePasswordController.update')
  Route.post('/users/:id/profile-pictures', 'ProfilePicturesController.store')
  Route.get('/users/:id/profile-pictures', 'ProfilePicturesController.index')
}).middleware(['auth'])

/* Admin routes */
Route.group(() => {
  Route.resource('admins', 'AdminsController').apiOnly().except(['destroy', 'store', 'show'])

  Route.put('/users/:id/change-password', 'UsersController.updateUserPassword')
  Route.get('/users/:id/profile-pictures', 'UsersController.getUserProfilePicture')
  Route.post('/users/:id/profile-pictures', 'UsersController.storeUserProfilePicture')
  Route.post('/generate-predictions', 'PredictionsController.generatePredictions')
  Route.post('/generate-total-cards-stats', 'PredictionsController.generateTotalCardsStats')
  Route.post('/load-stats-by-round', 'DataController.loadStatsByRound')
  Route.get('/get-current-round', 'PredictionsController.getCurrentRound')
  Route.post('/activate-customer', 'CustomersController.activate')
  Route.post('/load-league-data', 'DataController.loadLeagueData')
})
  .namespace('App/Controllers/Http/Admin')
  .prefix('admin')
  .middleware(['auth', 'role:admin'])

Route.group(() => {
  Route.get('/', 'CustomersController.index')
  Route.get('leagues', 'LeaguesController.index')
  Route.get('predictions', 'PredictionsController.index')
  Route.get('stat-types', 'StatTypesController.index')
})
  .namespace('App/Controllers/Http/Customer')
  .prefix('customer')
  .middleware(['auth', 'role:customer'])
