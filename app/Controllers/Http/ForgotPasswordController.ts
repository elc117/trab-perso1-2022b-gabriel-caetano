import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UserForgotChangeValidator from 'App/Validators/UserForgotChangeValidator'
import UserForgotPasswordValidator from 'App/Validators/UserForgotPasswordValidator'
import UserHelper from 'App/Helpers/UserHelper'

import User from 'App/Models/User'
import { DateTime } from 'luxon'
const crypto = require('crypto')

export default class ForgotPasswordController {
  public async store({ request, response }: HttpContextContract) {
    const { email } = await request.validate(UserForgotPasswordValidator)
    try {
      const user = await User.findBy('email', email)
      if (!user)
        return response.notFound({
          message: 'Não foi encontrado nenhum usuário com o email fornecido.',
        })
      const token = await crypto.randomBytes(10).toString('hex')
      await UserHelper.sendEmail(user, token)
      user.rememberMeToken = token
      user.rememberMeTokenCreatedAt = DateTime.local()
      await user.save()
    } catch (e) {
      console.log(e)
      console.log(`* Error sending password recovery email to ${email}`)
      return response.internalServerError({
        message: 'Ocorreu um problema com a recuperação.',
      })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    const tokenProvided = params.token
    const emailRequesting = params.email

    const { newPassword } = await request.validate(UserForgotChangeValidator)

    const user = await User.findByOrFail('email', emailRequesting)
    const sameToken = tokenProvided === user.rememberMeToken
    if (!sameToken)
      return response.unauthorized({
        message: 'Token de validação expirado ou já utilizado.',
      })
    // checking if token is still valid (48 hour period)
    const tokenExpired = DateTime.local().minus({ days: 2 })
    if (tokenExpired > user.rememberMeTokenCreatedAt!)
      return response.unauthorized({
        message:
          'O tempo limite para alterar a senha com esse token de validação (48 horas) expirou.',
      })
    //deleting all user tokens (from the old password)
    await UserHelper.deleteAllTokens(user)
    user.password = newPassword
    // deleting recovery token info
    user.rememberMeToken = null
    user.rememberMeTokenCreatedAt = null
    await user.save()
    return user
  }
}
