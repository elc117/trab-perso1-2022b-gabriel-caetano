import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import apiFootball from 'App/Services/ApiFootball'

export default class DataServiceController {
  public async index({ response }: HttpContextContract) {
    const italyLeagues = await apiFootball.leaguesByCountry('Italy')
    return response.send(italyLeagues)
  }
}
