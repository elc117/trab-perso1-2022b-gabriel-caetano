import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'
import Team from 'App/Models/Team'
import ApiFootballService from 'App/Services/ApiFootballService'
import slugify from 'slugify'

export default class TeamSeeder extends BaseSeeder {
  public async run() {
    const teamsData = await ApiFootballService.listTeamsByLeagueAndSeason(135, 2022)
    const teams: Team[] = []
    for (const teamData of teamsData.response) {
      const newTeam = new Team()
      const slug = slugify(teamData.team.name).toLowerCase()
      const country = await Country.findByOrFail('name', teamData.team.country)
      newTeam.merge({
        apiFootballId: teamData.team.id,
        name: teamData.team.name,
        slug,
        code: teamData.team.code,
        founded: teamData.team.founded,
        logoUrl: teamData.team.logo,
        sportId: 1,
        countryId: country.id,
      })
      teams.push(newTeam)
    }

    await Team.createMany(teams)
  }
}
