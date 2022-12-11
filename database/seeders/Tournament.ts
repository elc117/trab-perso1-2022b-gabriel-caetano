import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Sport from 'App/Models/Sport'
import Tournament from 'App/Models/Tournament'
import SofascoreService from 'App/Services/SofascoreService'

export default class TournamentSeeder extends BaseSeeder {
  private sofaScore = new SofascoreService()
  public async run() {
    const eventData = await this.sofaScore.getUniqueTournaments()
    const sports = await Sport.query()
    const tournaments: Tournament[] = []
    for (const tournament of eventData.uniqueTournaments) {
      const sportFound = sports.find((sport) => sport.sofascoreId === tournament.category.sport.id)
      const newTournament = new Tournament()
      newTournament.name = tournament.name
      newTournament.slug = tournament.slug
      newTournament.sportId = sportFound ? sportFound.id : 0
      newTournament.sofascoreId = tournament.id
      tournaments.push(newTournament)
    }
    Tournament.createMany(tournaments)
  }
}
