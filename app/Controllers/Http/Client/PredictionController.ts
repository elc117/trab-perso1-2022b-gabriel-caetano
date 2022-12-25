import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Prediction from 'App/Services/Prediction'

export default class PredictionController {
  public async index({ request, response }: HttpContextContract) {
    const { teamId, seasonId } = request.all()
    const res = Prediction.prediction1(seasonId, teamId, 16, 6.5, 'Corner Kicks')
    return res
  }
}
