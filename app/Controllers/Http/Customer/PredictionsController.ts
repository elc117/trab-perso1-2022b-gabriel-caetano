import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import League from 'App/Models/League'
import Match from 'App/Models/Match'
import Round from 'App/Models/Round'
import StatType from 'App/Models/StatType'
import Team from 'App/Models/Team'
import PredictionService from 'App/Services/PredictionService'
import IndexPredictionValidator from 'App/Validators/IndexPredictionValidator'

export default class PredictionController {
  public async index({ auth, request }: HttpContextContract) {
    const { leagueId, statType, betValue, underOver } = await request.validate(
      IndexPredictionValidator
    )
    const customer = await Customer.findOrFail(auth.user!.id)
    const { active } = customer
    const roundOrder = await PredictionService.getCurrentRound(leagueId)
    const round = await Round.findByOrFail('order', roundOrder)
    const league = await League.findOrFail(leagueId)
    const stat = await StatType.findOrFail(statType)

    const predictionsData = await PredictionService.listPredictions(
      leagueId,
      statType,
      betValue,
      underOver
    )

    const predictions = predictionsData.map((prediction) => {
      const matchData = prediction.$preloaded.match as Match
      const match = {
        id: matchData.id,
        date: matchData.date,
      }
      const awayTeamData = matchData.$preloaded.awayTeam as Team
      const awayTeam = {
        id: awayTeamData.id,
        name: awayTeamData.name,
        logoUrl: awayTeamData.logoUrl,
      }
      const homeTeamData = matchData.$preloaded.homeTeam as Team
      const homeTeam = {
        id: homeTeamData.id,
        name: homeTeamData.name,
        logoUrl: homeTeamData.logoUrl,
      }
      const calculatedPrediction = {
        predictionId: prediction.id,
        homeTeamPrediction: active ? prediction.homeTeamPrediction : 0,
        awayTeamPrediction: active ? prediction.awayTeamPrediction : 0,
        matchPrediction: active ? prediction.matchPrediction * prediction.manualRisc : 0,
      }

      return {
        prediction: calculatedPrediction,
        match,
        awayTeam,
        homeTeam,
      }
    })
    return {
      leagueId,
      leagueName: league.name,
      roundOrder,
      roundName: round.name,
      statType: stat.name,
      betValue,
      underOver,
      predictions,
    }
  }
}
