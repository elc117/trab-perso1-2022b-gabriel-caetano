import Stat from 'App/Models/Stat'
import Prediction from 'App/Services/PredictionService'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'
import ApiFootballService from 'App/Services/ApiFootballService'
import Team from 'App/Models/Team'
import Round from 'App/Models/Round'
import { DateTime } from 'luxon'
import Season from 'App/Models/Season'
import StatType from 'App/Models/StatType'

export default class PredictionController {
  public async generatePredictions() {
    const cornerValues = [12.5, 11.5, 10.5, 9.5, 8.5]
    const cardsValues = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5]
    for (const value of cornerValues) {
      await Prediction.generatePredictionsByLeague(8, value, 8, 'under')
      await Prediction.generatePredictionsByLeague(8, value, 8, 'over')
    }
    for (const value of cardsValues) {
      await Prediction.generatePredictionsByLeague(8, value, 17, 'under')
      await Prediction.generatePredictionsByLeague(8, value, 17, 'over')
    }
  }

  public async getCurrentRound() {
    return await Prediction.getCurrentRound(8)
  }

  public async generateTotalCardsStats() {
    const yellowCards = await Stat.query().where('stat_type_id', 11)
    const redCards = await Stat.query().where('stat_type_id', 12)
    const oldTotalCards = await Stat.query().where('stat_type_id', 17)
    const totalCards: Stat[] = []

    yellowCards.forEach((yc: Stat) => {
      const redCard = redCards.find(
        (rc) => rc.matchId === yc.matchId && rc.teamId === yc.teamId && rc.period === yc.period
      )!
      const exists = oldTotalCards.some(
        (tc) => tc.matchId === yc.matchId && tc.teamId === yc.teamId && tc.period === yc.period
      )
      if (!exists) {
        const totalCard = new Stat()
        totalCard.merge({
          matchId: yc.matchId,
          teamId: yc.teamId,
          statTypeId: 17,
          period: yc.period,
          value: yc.value + redCard.value,
        })
        totalCards.push(totalCard)
      }
    })

    await Stat.createMany(totalCards)
  }

  public async getStatsByRound({ request }: HttpContextContract) {
    const { roundOrder, leagueId } = request.all()
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
    const statsArray: Stat[] = []
    for (const match of matches) {
      const fixtureData = await ApiFootballService.getStatsByFixtureId(match.fixtureId)
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
    await Stat.createMany(statsArray)
  }
}
