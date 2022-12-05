import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

/* Session routes */
Route.post('sessions', 'SessionsController.create')
Route.post('/sessions/validate', 'SessionController.validate')

/* Forgot password routes */
Route.post('users/forgot-password', 'ForgotPasswordController.store')
Route.put('users/forgot-password/:token/:email', 'ForgotPasswordController.update')

/* Update user info routes */
Route.group(() => {
  Route.post('sessions/logout', 'SessionsController.destroy') //removes current token from api_tokens table

  Route.put('/users/:id/change-password', 'ChangePasswordController.update')
  Route.post('/users/:id/profile-pictures', 'ProfilePictureController.store')
  Route.get('/users/:id/profile-pictures', 'ProfilePictureController.index')
}).middleware(['auth'])

/* Admin routes */
Route.group(() => {
  Route.resource('admins', 'AdminController').apiOnly().except(['destroy', 'store', 'show'])

  Route.put('/users/:id/change-password', 'UserController.updateUserPassword')
  Route.get('/users/:id/profile-pictures', 'UserController.getUserProfilePicture')
  Route.post('/users/:id/profile-pictures', 'UserController.storeUserProfilePicture')
})
  .namespace('App/Controllers/Http/Admin')
  .prefix('admin')
  .middleware(['auth', 'role:admin'])
