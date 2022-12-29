import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prediction from 'App/Services/PredictionService'

export default class PredictionController {
  public async index({ request }: HttpContextContract) {
    const { matchId } = request.all()
    const res12 = await Prediction.predictionsByMatch(matchId, 12.5, 8, 'under')
    const res11 = await Prediction.predictionsByMatch(matchId, 11.5, 8, 'under')
    const res10 = await Prediction.predictionsByMatch(matchId, 10.5, 8, 'under')
    const res9 = await Prediction.predictionsByMatch(matchId, 9.5, 8, 'under')
    const res8 = await Prediction.predictionsByMatch(matchId, 8.5, 8, 'under')
    return { res12, res11, res10, res9, res8 }
  }

  public async generatePredictions() {
    await Prediction.generatePredictionsByLeague(8, 12.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 11.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 10.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 9.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 8.5, 8, 'under')
  }
}
