import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

import SessionUserValidator from 'App/Validators/SessionUserValidator'
import UserHelper from 'App/Helpers/UserHelper'

export default class SessionsController {
  public async create({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate(SessionUserValidator)
    try {
      const token = await auth.attempt(email, password)
      const user = await User.findByOrFail('email', email)
      const roles = await UserHelper.getRoles(user)
      return { auth: token, roles: roles }
    } catch (e) {
      return response.unauthorized({ message: 'Falha na autenticação.' })
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    if (auth.isAuthenticated) {
      await auth.use('api').revoke()
      return response.ok({})
    }
    return response.badRequest('You are not logged in')
  }

  public async validate({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.user
      const { endpoint } = request.only(['endpoint'])
      const roles = await UserHelper.getRoles(user!)
      if (!roles.includes(endpoint)) throw new Error('Invalid endpoint')
      return endpoint
    } catch (error) {
      response.unauthorized({ message: 'Invalid token or endpoint' })
    }
  }
}
