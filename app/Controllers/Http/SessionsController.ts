import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

import SessionUserValidator from 'App/Validators/SessionUserValidator'
import RegisterCustomerValidator from 'App/Validators/RegisterCustomerValidator'
import UserHelper from 'App/Helpers/UserHelper'
import Database from '@ioc:Adonis/Lucid/Database'
import Customer from 'App/Models/Customer'
import { DateTime } from 'luxon'
import Role from 'App/Models/Role'

export default class SessionsController {
  public async register({ request, response }: HttpContextContract) {
    const { email, password } = await request.validate(SessionUserValidator)
    const { name } = await request.validate(RegisterCustomerValidator)
    const trx = await Database.transaction()
    try {
      const user = await User.create({ email, password }, trx)
      const role = await Role.findByOrFail('slug', 'customer')
      await trx.insertQuery().table('role_users').insert({
        role_id: role.id,
        user_id: user.id,
      })
      await Customer.create({ userId: user.id, name }, trx)
      await trx.commit()
      return response.created()
    } catch (e) {
      await trx.rollback()
      console.log(e)
      return response.unauthorized({ message: 'Houve um problema com o cadastro.' })
    }
  }

  public async create({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate(SessionUserValidator)
    try {
      const token = await auth.attempt(email, password)
      const user = await User.findByOrFail('email', email)
      const roles = await UserHelper.getRoles(user)
      user.lastLogin = DateTime.now()
      await user.save()
      return { auth: token, roles: roles }
    } catch (e) {
      console.log(e)
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
