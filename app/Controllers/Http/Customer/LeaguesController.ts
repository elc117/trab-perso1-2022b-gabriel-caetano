import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import League from 'App/Models/League'

export default class LeaguesController {
  public async index() {
    const leagues = await League.query()
    return leagues.map((league) => {
      return {
        id: league.id,
        sportId: league.sportId,
        countryId: league.countryId,
        name: league.name,
        slug: league.slug,
        logoUrl: league.logoUrl,
        active: league.active,
      }
    })
  }
}
