import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
import Mail from '@ioc:Adonis/Addons/Mail'

import Hash from '@ioc:Adonis/Core/Hash'

import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import ProfilePicture from 'App/Models/ProfilePicture'
import UserPasswordChangeValidator from 'App/Validators/UserPasswordChangeValidator'

class UserHelper {
  public async storeUserProfilePicture(request, response, user: User) {
    try {
      const file = request.file('image', {
        size: '2mb',
        extnames: ['jpg', 'png', 'gif'],
      })
      if (!file?.isValid) return response.badRequest(file?.errors)
      const key = `${Env.get('S3_DIRECTORY')}/${Date.now()}-${file?.clientName.replace(/\s/g, '-')}`
      await file?.moveToDisk('', { contentType: file.headers['content-type'], key }, 's3')
      const url = await Drive.getUrl(key)

      const userProfilePicture = await ProfilePicture.findBy('user_id', user.id)
      if (!userProfilePicture)
        return await ProfilePicture.create({ user_id: user.id, url: url, key: key })

      const oldKey = userProfilePicture.key
      userProfilePicture.merge({ url: url, key: key })
      await userProfilePicture.save()
      if (oldKey) await Drive.delete(oldKey)
    } catch (e) {
      console.log(e)
    }
  }

  public async sendEmail(user: User, token) {
    try {
      await Mail.send((message) => {
        message
          .to(user.email)
          .subject('Portal da Inovação - Recuperação de senha')
          .htmlView('emails.recover-password', { user })
          .htmlView('email.recover-password-text', { token })
      })
    } catch (e) {
      console.log(e)
    }
  }

  public async deleteAllTokens(user: User) {
    const trx = await Database.transaction()
    try {
      await trx.from('api_tokens').where('user_id', user.id).delete()
      await trx.commit()
    } catch (e) {
      console.log(e)
      await trx.rollback()
    }
  }

  public async getRoles(user: User) {
    const rolesUser = await Database.query()
      .select('slug as role')
      .from('role_users')
      .where('user_id', user.id)
      .innerJoin('roles', 'roles.id', 'role_users.role_id')
    return rolesUser.map((value) => value.role)
  }

  public async updateUserPassword(user: User, request, response, check_old_password = false) {
    if (check_old_password) {
      const data = await request.only(['oldPassword'])
      const oldPasswordIsValid = await Hash.verify(user.password, data.oldPassword)
      if (!oldPasswordIsValid) return response.badRequest({ message: 'Senha antiga inválida.' })
    }
    const { newPassword } = await request.validate(UserPasswordChangeValidator)
    user.merge({ password: newPassword })
    await user.save()
    return response.ok()
  }
}

export default new UserHelper()
