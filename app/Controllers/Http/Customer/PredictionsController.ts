import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'
import Team from 'App/Models/Team'
import PredictionService from 'App/Services/PredictionService'
import IndexPredictionValidator from 'App/Validators/IndexPredictionValidator'

export default class PredictionController {
  public async index({ request }: HttpContextContract) {
    const { leagueId, statType, betValue, underOver } = await request.validate(
      IndexPredictionValidator
    )
    const predictions = await PredictionService.indexPredictions(
      leagueId,
      statType,
      betValue,
      underOver
    )

    return predictions.map((prediction) => {
      const matchData = prediction.$preloaded.match as Match
      const match = new Match()
      match.merge({
        id: matchData.id,
        roundId: matchData.roundId,
        date: matchData.date,
      })
      const awayTeamData = matchData.$preloaded.awayTeam as Team
      const awayTeam = new Team()
      awayTeam.merge({
        id: awayTeamData.id,
        countryId: awayTeamData.countryId,
        name: awayTeamData.name,
        slug: awayTeamData.slug,
        code: awayTeamData.code,
        founded: awayTeamData.founded,
        logoUrl: awayTeamData.logoUrl,
      })
      const homeTeamData = matchData.$preloaded.homeTeam as Team
      const homeTeam = new Team()
      homeTeam.merge({
        id: homeTeamData.id,
        countryId: homeTeamData.countryId,
        name: homeTeamData.name,
        slug: homeTeamData.slug,
        code: homeTeamData.code,
        founded: homeTeamData.founded,
        logoUrl: homeTeamData.logoUrl,
      })

      return {
        id: prediction.id,
        match,
        awayTeam,
        homeTeam,
        statTypeId: prediction.statTypeId,
        underOver: prediction.underOver,
        betValue: prediction.betValue,
        homeTeamPrediction: prediction.homeTeamPrediction,
        awayTeamPrediction: prediction.awayTeamPrediction,
        matchPrediction: prediction.matchPrediction * prediction.manualRisc,
      }
    })
  }
}
