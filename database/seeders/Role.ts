import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const trx = await Database.transaction()
    try {
      await trx.table('roles').multiInsert([
        { slug: 'admin', description: 'manage administrator privileges' },
        { slug: 'company', description: 'manage company privileges' },
        { slug: 'collaborator', description: 'manage collaborator privileges' },
      ])
      await trx.commit()
    } catch (error) {
      await trx.rollback()
    }
  }
}
