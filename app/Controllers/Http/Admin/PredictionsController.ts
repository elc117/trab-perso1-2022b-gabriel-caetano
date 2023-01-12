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
  public async generatePredictions({ response }: HttpContextContract) {
    return response.internalServerError({ message: `Rota desativada` })
    // const cornerValues = [12.5, 11.5, 10.5, 9.5, 8.5]
    // const cardsValues = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5]
    // for (const value of cornerValues) {
    // await Prediction.generatePredictionsByLeague(8, value, 8, 'under')
    // await Prediction.generatePredictionsByLeague(8, value, 8, 'over')
    // }
    // for (const value of cardsValues) {
    //   await Prediction.generatePredictionsByLeague(8, value, 17, 'under')
    //   await Prediction.generatePredictionsByLeague(8, value, 17, 'over')
    // }
  }

  public async getCurrentRound({ request }: HttpContextContract) {
    const { leagueId } = request.all()
    return await Prediction.getCurrentRound(leagueId)
  }

  public async generateTotalCardsStats({ response }: HttpContextContract) {
    return response.internalServerError({ message: `Rota desativada` })
    // const yellowCards = await Stat.query().where('stat_type_id', 11)
    // const redCards = await Stat.query().where('stat_type_id', 12)
    // const oldTotalCards = await Stat.query().where('stat_type_id', 17)
    // const totalCards: Stat[] = []

    // yellowCards.forEach((yc: Stat) => {
    //   const exists = oldTotalCards.some(
    //     (tc) => tc.matchId === yc.matchId && tc.teamId === yc.teamId && tc.period === yc.period
    //   )
    //   if (!exists) {
    //     const redCard = redCards.find(
    //       (rc) => rc.matchId === yc.matchId && rc.teamId === yc.teamId && rc.period === yc.period
    //     )!
    //     const totalCard = new Stat()
    //     totalCard.merge({
    //       matchId: yc.matchId,
    //       teamId: yc.teamId,
    //       statTypeId: 17,
    //       period: yc.period,
    //       value: yc.value + redCard.value,
    //     })
    //     totalCards.push(totalCard)
    //   }
    // })

    // await Stat.createMany(totalCards)
  }
}
