import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Round from 'App/Models/Round'
import ApiFootball from 'App/Services/ApiFootball'

export default class RoundSeeder extends BaseSeeder {
  private leagueId = 135
  private season = 2022
  private seasonId = 13
  public async run() {
    const roundsData = await ApiFootball.getRoundsByLeagueAndSeason(this.leagueId, this.season)
    const rounds: Round[] = []
    for (const roundData of roundsData.response) {
      const newRound = new Round()
      const order = parseInt(roundData.split(' ').at(-1))
      newRound.merge({
        seasonId: this.seasonId,
        name: roundData,
        order,
      })
      rounds.push(newRound)
    }
    await Round.createMany(rounds)
  }
}
