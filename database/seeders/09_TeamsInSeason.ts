import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Team from 'App/Models/Team'

interface TeamsSeason {
  team_id: number
  season_id: number
}

export default class TeamsInSeasonSeeder extends BaseSeeder {
  private seasonId = 13
  public async run() {
    const ts: TeamsSeason[] = []
    const teams = await Team.query()
    teams.forEach((team) => {
      ts.push({
        season_id: this.seasonId,
        team_id: team.id,
      })
    })

    await Database.table('teams_seasons').multiInsert(ts)
  }
}
