import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Admin from 'App/Models/Admin'
export default class UserSeeder extends BaseSeeder {
  public async run() {
    const user = await User.create({
      email: Env.get('ADMIN_EMAIL'),
      password: Env.get('ADMIN_PASSWORD'),
    })

    await Admin.create({
      userId: user.id,
      name: Env.get('ADMIN_NAME'),
      position: Env.get('ADMIN_POSITION'),
    })
  }
}
