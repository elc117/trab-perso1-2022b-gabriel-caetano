import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserHelper from 'App/Helpers/UserHelper'
import ProfilePicture from 'App/Models/ProfilePicture'

export default class UserController {
  public async updateUserPassword({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return await UserHelper.updateUserPassword(user, request, response)
  }

  public async getUserProfilePicture({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return await ProfilePicture.findBy('user_id', user.id)
  }

  public async storeUserProfilePicture({ params, request, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await UserHelper.storeUserProfilePicture(request, response, user)
  }
}
