import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Admin from 'App/Models/Admin'
import Database from '@ioc:Adonis/Lucid/Database'
export default class UserSeeder extends BaseSeeder {
  public async run() {
    const trx = await Database.transaction()
    try {
      const user = await User.create(
        {
          email: Env.get('ADMIN_EMAIL'),
          password: Env.get('ADMIN_PASSWORD'),
        },
        trx
      )

      await Admin.create(
        {
          userId: user.id,
          name: Env.get('ADMIN_NAME'),
          position: Env.get('ADMIN_POSITION'),
        },
        trx
      )
    } catch (e) {
      console.log(e)
    }
  }
}
