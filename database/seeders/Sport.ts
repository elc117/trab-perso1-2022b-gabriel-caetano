import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Sport from 'App/Models/Sport'
import SofascoreService from 'App/Services/SofascoreService'

export default class SportSeeder extends BaseSeeder {
  private sofaScore = new SofascoreService()

  public async run() {
    const eventData = await this.sofaScore.getUniqueTournaments()
    const sports: Sport[] = []
    for (const tournament of eventData.uniqueTournaments) {
      const exist = sports.find((sport) => sport.sofascoreId === tournament.category.sport.id)
      if (!exist) {
        const newSport = new Sport()
        newSport.name = tournament.category.sport.name
        newSport.slug = tournament.category.sport.slug
        newSport.sofascoreId = tournament.category.sport.id
        sports.push(newSport)
      }
    }
    await Sport.createMany(sports)
  }
}
