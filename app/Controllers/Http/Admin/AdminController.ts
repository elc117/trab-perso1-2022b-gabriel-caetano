import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfilePicture from 'App/Models/ProfilePicture'

import Admin from 'App/Models/Admin'

export default class AdminController {
  public async index({ auth, request }: HttpContextContract) {
    const data = request.all()
    const user = await auth.user!
    if (data.validation) {
      const admin = await user.related('admin').query().select(['name'])
      const validationData = {
        admin: admin,
        profile_picture: await ProfilePicture.findBy('user_id', user.id),
      }
      return validationData
    }
    const admin = await user.related('admin').query().first()
    if (admin) {
      const dados = {
        profile_picture: await ProfilePicture.findBy('user_id', user.id),
        email: user.email,
      }
      return dados
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const admin = await Admin.findOrFail(params.id)
    const data = request.only(['name', 'sector'])
    admin.merge(data)
    await admin.save()
    return admin
  }
}
