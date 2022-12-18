import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'
import League from 'App/Models/League'
import apiFootball from 'App/Services/ApiFootball'
import slugify from 'slugify'

export default class LeagueSeeder extends BaseSeeder {
  public async run() {
    const leaguesData = await apiFootball.listLeagues()
    const leagues: League[] = []
    for (const leagueData of leaguesData.response) {
      const newLeague = new League()
      const slug = slugify(leagueData.league.name).toLowerCase()
      const country = await Country.findByOrFail('name', leagueData.country.name)
      newLeague.merge({
        apiFootballId: leagueData.league.id,
        name: leagueData.league.name,
        slug,
        logoUrl: leagueData.league.logo,
        sportId: 1,
        countryId: country.id,
      })
      leagues.push(newLeague)
    }
    await League.createMany(leagues)
  }
}
