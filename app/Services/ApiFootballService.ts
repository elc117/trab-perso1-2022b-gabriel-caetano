import fetch from 'node-fetch'
import Env from '@ioc:Adonis/Core/Env'
import Stat from 'App/Models/Stat'
import Team from 'App/Models/Team'
import Match from 'App/Models/Match'
import { DateTime } from 'luxon'
import Season from 'App/Models/Season'
import Round from 'App/Models/Round'
import StatType from 'App/Models/StatType'

/**
 * Service to connect with football data source
 * Documentation for the api used?
 * https://www.api-football.com/documentation-v3
 * To have access to the needed keys contact the admin
 */
class ApiFootballService {
  private apiHost = Env.get('API_FOOTBALL_HOST')
  private baseUrl = `https://${this.apiHost}`

  private async get(subUrl: string) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': Env.get('API_FOOTBALL_KEY'),
        'X-RapidAPI-Host': this.apiHost,
      },
    }
    const data = await fetch(this.baseUrl + subUrl, options)
    return await data.json()
  }

  public async leaguesByCountry(country: string) {
    const subUrl = `/leagues?country=${country}`
    return await this.get(subUrl)
  }

  public async listCountries() {
    return await this.get('/countries')
  }

  public async listLeagues() {
    return await this.get('/leagues')
  }

  public async listTeamsByLeagueAndSeason(league: number, season: number) {
    return await this.get(`/teams?league=${league}&season=${season}`)
  }

  public async getLeagueById(id: number) {
    return await this.get(`/leagues?id=${id}`)
  }

  public async getRoundsByLeagueAndSeason(leagueId: number, season: number) {
    return await this.get(`/fixtures/rounds?league=${leagueId}&season=${season}`)
  }

  public async getFixturesByLeagueAndSeason(leagueId: number, season: number) {
    return await this.get(`/fixtures?league=${leagueId}&season=${season}`)
  }

  public async loadStatsByFixtureId(fixtureId: number) {
    return await this.get(`/fixtures/statistics?fixture=${fixtureId}`)
  }

  public async loadStatsByRound(roundOrder: number, leagueId: number) {
    const today = DateTime.now().toISODate()
    const season = await Season.query()
      .select('id')
      .where('league_id', leagueId)
      .andWhere('start_date', '<', today)
      .andWhere('end_date', '>', today)
      .firstOrFail()
    const round = await Round.query()
      .where('season_id', season.id)
      .andWhere('order', roundOrder)
      .first()
    const matches = await Match.query().select('*').where('round_id', round!.id)
    console.log('matches: ', matches.length)
    const statsArray: Stat[] = []
    for (const match of matches) {
      const fixtureData = await this.loadStatsByFixtureId(match.fixtureId)
      for (const teamData of fixtureData.response) {
        const apiFootballId = teamData.team.id
        const team = await Team.findByOrFail('api_football_id', apiFootballId)
        for (const stats of teamData.statistics) {
          let value = 0
          if (typeof stats.value === 'string') value = parseInt(stats.value)
          if (typeof stats.value === 'number') value = stats.value
          const statType = await StatType.findByOrFail('name', stats.type)
          const exist = await Stat.query()
            .where('match_id', match.id)
            .andWhere('team_id', team.id)
            .andWhere('stat_type_id', statType.id)
            .andWhere('period', 'total')
            .first()
          if (!exist) {
            const newStats = new Stat()
            newStats.merge({
              matchId: match.id,
              teamId: team.id,
              statTypeId: statType.id,
              period: 'total',
              value,
            })
            statsArray.push(newStats)
          }
        }
      }
    }
    console.log('data: ', statsArray.length)
    await Stat.createMany(statsArray)
    console.log(`round ${roundOrder} done.`)
  }
}
export default new ApiFootballService()
