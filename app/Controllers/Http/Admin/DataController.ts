import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'
import ApiFootballService from 'App/Services/ApiFootballService'
import Team from 'App/Models/Team'
import Round from 'App/Models/Round'
import { DateTime } from 'luxon'
import Season from 'App/Models/Season'
import League from 'App/Models/League'
import slugify from 'slugify'
import Country from 'App/Models/Country'
import Stat from 'App/Models/Stat'
import StatType from 'App/Models/StatType'

export default class DataController {
  private leagueApiId: number
  private leagueId: number
  private season: Season

  public async loadLeagueData({ request, response }: HttpContextContract) {
    const { leagueId: requestLeagueId } = request.all()
    return response.internalServerError({
      message: `Rota desativada`,
      params: { leagueId: requestLeagueId },
    })
    // this.leagueId = requestLeagueId
    // const league = await League.findOrFail(this.leagueId)
    // this.leagueApiId = league.apiFootballId
    // await this.loadSeasons()
    // console.log('loaded seasons...')
    // const today = DateTime.now().toISODate()
    // this.season = await Season.query()
    //   .select('*')
    //   .where('league_id', this.leagueId)
    //   .andWhere('start_date', '<', today)
    //   .andWhere('end_date', '>', today)
    //   .firstOrFail()
    // await this.loadTeams()
    // console.log('loaded teams...')
    // await this.loadRounds()
    // console.log('loaded rounds...')
    // console.log('startted...')
    // await this.loadMatches()
    // console.log('loaded matches...')
  }

  private async loadSeasons() {
    const leagueData = await ApiFootballService.getLeagueById(this.leagueApiId)

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

  private async loadRounds() {
    const roundsData = await ApiFootballService.getRoundsByLeagueAndSeason(
      this.leagueApiId,
      this.season.year
    )
    const rounds: Round[] = []
    for (const roundData of roundsData.response) {
      const newRound = new Round()
      const order = parseInt(roundData.split(' ').at(-1))
      newRound.merge({
        seasonId: this.season.id,
        name: roundData,
        order,
      })
      rounds.push(newRound)
    }
    await Round.createMany(rounds)
  }

  private async loadTeams() {
    const teamsData = await ApiFootballService.listTeamsByLeagueAndSeason(
      this.leagueApiId,
      this.season.year
    )
    const teams: Team[] = []
    for (const teamData of teamsData.response) {
      const newTeam = new Team()
      const slug = slugify(teamData.team.name).toLowerCase()
      const country = await Country.findByOrFail('name', teamData.team.country)
      newTeam.merge({
        apiFootballId: teamData.team.id,
        name: teamData.team.name,
        slug,
        code: teamData.team.code,
        founded: teamData.team.founded,
        logoUrl: teamData.team.logo,
        sportId: 1,
        countryId: country.id,
      })
      teams.push(newTeam)
    }

    await Team.createMany(teams)
  }

  private async loadMatches() {
    const fixturesData = await ApiFootballService.getFixturesByLeagueAndSeason(
      this.leagueApiId,
      this.season.year
    )
    console.log('start...')

    const matches: Match[] = []
    for (const fixtureData of fixturesData.response) {
      const roundName = fixtureData.league.round
      const round = await Round.query()
        .where('name', roundName)
        .andWhere('season_id', this.season.id)
        .firstOrFail()
      const homeTeam = await Team.findByOrFail('api_football_id', fixtureData.teams.home.id)
      const awayTeam = await Team.findByOrFail('api_football_id', fixtureData.teams.away.id)

      const newMatch = new Match()
      newMatch.merge({
        fixtureId: fixtureData.fixture.id,
        roundId: round.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        date: fixtureData.fixture.date,
      })
      matches.push(newMatch)
    }
    console.log('end 1...')

    await Match.createMany(matches)
    console.log('end 2...')
  }

  public async loadStatsByRound({ request, response }: HttpContextContract) {
    const { roundOrder, leagueId } = request.all()
    return response.internalServerError({
      message: `Rota desativada`,
      params: { roundOrder, leagueId },
    })
    // const today = DateTime.now().toISODate()
    // const season = await Season.query()
    //   .select('id')
    //   .where('league_id', leagueId)
    //   .andWhere('start_date', '<', today)
    //   .andWhere('end_date', '>', today)
    //   .firstOrFail()
    // const round = await Round.query()
    //   .where('season_id', season.id)
    //   .andWhere('order', roundOrder)
    //   .first()
    // const matches = await Match.query().select('*').where('round_id', round!.id)
    // console.log('matches: ', matches.length)
    // const statsArray: Stat[] = []
    // for (const match of matches) {
    //   const fixtureData = await ApiFootballService.getStatsByFixtureId(match.fixtureId)
    //   for (const teamData of fixtureData.response) {
    //     const apiFootballId = teamData.team.id
    //     const team = await Team.findByOrFail('api_football_id', apiFootballId)
    //     for (const stats of teamData.statistics) {
    //       let value = 0
    //       if (typeof stats.value === 'string') value = parseInt(stats.value)
    //       if (typeof stats.value === 'number') value = stats.value
    //       const statType = await StatType.findByOrFail('name', stats.type)
    //       const exist = await Stat.query()
    //         .where('match_id', match.id)
    //         .andWhere('team_id', team.id)
    //         .andWhere('stat_type_id', statType.id)
    //         .andWhere('period', 'total')
    //         .first()
    //       if (!exist) {
    //         const newStats = new Stat()
    //         newStats.merge({
    //           matchId: match.id,
    //           teamId: team.id,
    //           statTypeId: statType.id,
    //           period: 'total',
    //           value,
    //         })
    //         statsArray.push(newStats)
    //       }
    //     }
    //   }
    // }
    // console.log('data: ', statsArray.length)
    // await Stat.createMany(statsArray)
    // console.log(`round ${roundOrder} done.`)
  }
}
