import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import StatType from 'App/Models/StatType'

export default class UpdateStatSeeder extends BaseSeeder {
  public async run() {
    const types = await StatType.query().select('*')
    for (const type of types) {
      await Database.from('stats').where('type', type.name).update({ stat_type_id: type.id })
    }
  }
}
