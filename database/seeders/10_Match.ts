import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Round from 'App/Models/Round'
import Match from 'App/Models/Match'
import ApiFootballService from 'App/Services/ApiFootballService'
import Team from 'App/Models/Team'

export default class MatchSeeder extends BaseSeeder {
  private leagueId = 135
  private season = 2022
  public async run() {
    const fixturesData = await ApiFootballService.getFixturesByLeagueAndSeason(
      this.leagueId,
      this.season
    )
    const matches: Match[] = []
    for (const fixtureData of fixturesData.response) {
      const roundName = fixtureData.league.round
      const round = await Round.findByOrFail('name', roundName)
      const homeTeam = await Team.findByOrFail('api_football_id', fixtureData.teams.home.id)
      const awayTeam = await Team.findByOrFail('api_football_id', fixtureData.teams.away.id)

      const newMatch = new Match()
      newMatch.merge({
        fixtureId: fixtureData.fixture.id,
        roundId: round.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        date: fixtureData.fixture.date,
      })
      matches.push(newMatch)
    }
    await Match.createMany(matches)
  }
}
