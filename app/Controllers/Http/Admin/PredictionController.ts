import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prediction from 'App/Services/PredictionService'

export default class PredictionController {
  public async index({ request, response }: HttpContextContract) {
    const { matchId } = request.all()
    const res12 = await Prediction.predictionsByMatch(matchId, 12.5, 'Corner Kicks')
    const res11 = await Prediction.predictionsByMatch(matchId, 11.5, 'Corner Kicks')
    const res10 = await Prediction.predictionsByMatch(matchId, 10.5, 'Corner Kicks')
    const res9 = await Prediction.predictionsByMatch(matchId, 9.5, 'Corner Kicks')
    const res8 = await Prediction.predictionsByMatch(matchId, 8.5, 'Corner Kicks')
    return { res12, res11, res10, res9, res8 }
  }

  public async generatePredictions() {
    // const leagues = await League.query().where('active', true)

    return await Prediction.generatePredictionsByLeague(135, 12.5, 'Corner Kicks')
    // for (const league of leagues) {

    // })
  }
}
