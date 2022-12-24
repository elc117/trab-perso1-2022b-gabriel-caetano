import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Season from 'App/Models/Season'
import ApiFootball from 'App/Services/ApiFootball'

export default class SeasonSeeder extends BaseSeeder {
  private leagueId = 135
  public async run() {
    const leagueData = await ApiFootball.getLeagueById(this.leagueId)
    console.log(leagueData)

    const seasons: Season[] = []
    for (const seasonData of leagueData.response[0].seasons) {
      const newSeason = new Season()
      newSeason.merge({
        leagueId: this.leagueId,
        year: seasonData.year,
        startDate: seasonData.start,
        endDate: seasonData.end,
      })
      seasons.push(newSeason)
    }
    await Season.createMany(seasons)
  }
}
