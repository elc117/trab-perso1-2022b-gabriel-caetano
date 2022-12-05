import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UserHelper from 'App/Helpers/UserHelper'
import ProfilePicture from 'App/Models/ProfilePicture'

export default class ProfilePicturesController {
  public async index({ auth, params, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user || !auth.user || user.id !== auth.user.id)
      return response.unauthorized('Not authorized')
    return await ProfilePicture.findBy('user_id', user.id)
  }

  public async store({ auth, params, request, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user || !auth.user || user.id !== auth.user.id)
      return response.unauthorized('Not authorized')
    await UserHelper.storeUserProfilePicture(request, response, user)
  }
}
