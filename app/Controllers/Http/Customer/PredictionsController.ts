import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndexPredictionValidator from 'App/Validators/IndexPredictionValidator'

export default class PredictionController {
  public async index({ request }: HttpContextContract) {
    const { leagueId, betValue, statType, underOver } = await request.validate(
      IndexPredictionValidator
    )

    return { leagueId, betValue, statType, underOver }
  }
}
