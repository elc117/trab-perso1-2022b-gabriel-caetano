import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApiFootballService from 'App/Services/ApiFootballService'

export default class DataServiceController {
  public async index({ response }: HttpContextContract) {
    const italyLeagues = await ApiFootballService.leaguesByCountry('Italy')
    return response.send(italyLeagues)
  }
}
