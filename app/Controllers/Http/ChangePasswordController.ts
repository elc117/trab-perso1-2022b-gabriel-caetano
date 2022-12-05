import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'
import UpdateUserPasswordValidator from 'App/Validators/UpdateUserPasswordValidator'

export default class ChangePasswordController {
  public async update({ auth, params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)

    if (!auth.user || !user || user.id !== auth.user.id)
      return response.unauthorized('Not authorized')
    const { oldPassword, newPassword } = await request.validate(UpdateUserPasswordValidator)
    const verifyPassword = await Hash.verify(user.password, oldPassword)
    if (!verifyPassword) return response.badRequest({ message: 'Senha antiga inválida.' })

    user.merge({ password: newPassword })
    await user.save()
    return response.ok({})
  }
}
