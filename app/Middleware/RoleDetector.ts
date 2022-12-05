import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

import Database from '@ioc:Adonis/Lucid/Database'

/*
Usage: .middleware(role:role1,role2,...)
*/
export default class RoleDetector {
  //protected redirectTo = '/rota'

  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
    if (auth.user && guards) {
      const rolesUser = await Database.query()
        .from('role_users')
        .where('user_id', auth.user.id)
        .innerJoin('roles', 'roles.id', 'role_users.role_id')
        .whereIn('slug', guards)

      if (rolesUser.length !== guards.length) {
        throw new AuthenticationException(
          'Unauthorized access',
          'E_UNAUTHORIZED_ACCESS'
          //this.redirectTo
        )
      }
    }
    await next()
  }
}
