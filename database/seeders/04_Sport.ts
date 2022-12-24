import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Sport from 'App/Models/Sport'

export default class SportSeeder extends BaseSeeder {
  public async run() {
    await Sport.create({
      name: 'Football',
      slug: 'football',
    })
  }
}
