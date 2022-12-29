import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Stat from 'App/Models/Stat'
import StatType from 'App/Models/StatType'
import slugify from 'slugify'

export default class StatTypeSeeder extends BaseSeeder {
  public async run() {
    const types = await Stat.query().distinct('type')
    console.log(types)
    const statTypes: StatType[] = []
    types.forEach((type) => {
      const slug = slugify(type.type).toLowerCase()
      const newStatType = new StatType()
      newStatType.merge({ name: type.type, slug })
      statTypes.push(newStatType)
    })
    await StatType.createMany(statTypes)
  }
}
