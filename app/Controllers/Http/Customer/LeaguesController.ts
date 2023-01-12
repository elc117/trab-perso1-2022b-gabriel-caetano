// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import League from 'App/Models/League'

export default class LeaguesController {
  public async index() {
    const leagues = await League.query().preload('country')
    const leaguesRes = leagues.map((league) => {
      return {
        id: league.id,
        sportId: league.sportId,
        countryId: league.countryId,
        name: league.name,
        slug: `${league.slug}-${league.country.slug}`,
        logoUrl: league.logoUrl,
        active: league.active,
      }
    })
    let slugs = leaguesRes.map((x) => x.slug)
    slugs = [...slugs, slugs.at(1)]
    const slugsSet = new Set(slugs)
    console.log(slugs.length)
    console.log([...slugsSet].length)

    return leaguesRes
  }
}
