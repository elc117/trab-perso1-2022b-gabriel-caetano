import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Match from 'App/Models/Match'
import Stat from 'App/Models/Stat'
import Team from 'App/Models/Team'
import ApiFootballService from 'App/Services/ApiFootballService'

/**
 * done:
 * falta do 16 em diante
 * 15
 */

export default class StatSeeder extends BaseSeeder {
  public async run() {
    const matches = await Match.query().select('*').where('round_id', 15)
    const statsArray: Stat[] = []
    for (const match of matches) {
      const fixtureData = await ApiFootballService.getStatsByFixtureId(match.fixtureId)
      for (const teamData of fixtureData.response) {
        const apiFootballId = teamData.team.id
        const team = await Team.findByOrFail('api_football_id', apiFootballId)
        for (const stats of teamData.statistics) {
          const newStats = new Stat()
          let value = 0
          if (typeof stats.value === 'string') value = parseInt(stats.value)
          if (typeof stats.value === 'number') value = stats.value
          newStats.merge({
            matchId: match.id,
            teamId: team.id,
            type: stats.type,
            value,
          })
          statsArray.push(newStats)
        }
      }
    }
    await Stat.createMany(statsArray)
  }
}
