import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prediction from 'App/Services/Prediction'

export default class PredictionController {
  public async index({ request, response }: HttpContextContract) {
    const { leagueId } = request.all()
    // const res = Prediction.predictionsByMatch(matchId, 12.5, 'Corner Kicks')
    const res = Prediction.getCurrentRound(leagueId)
    return res
  }
}
