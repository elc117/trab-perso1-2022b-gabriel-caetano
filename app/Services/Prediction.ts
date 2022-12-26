import Match from 'App/Models/Match'
import Round from 'App/Models/Round'
import Season from 'App/Models/Season'
import Team from 'App/Models/Team'
import { DateTime } from 'luxon'

class Prediction {
  public async getCurrentRound(LeagueId: number) {
    const today = DateTime.now()
    const season = await Season.query()
      .select('id')
      .where('league_id', LeagueId)
      .orderBy('year', 'desc')
      .firstOrFail()
    console.log(season)

    const rounds = await Round.query()
      .select(['rounds.*', 'm.round_id'])
      .leftJoin('matches as m', 'm.round_id', 'rounds.id')
      .where('season_id', season.id)
      .where('m.date', '<', today.toISO())
      .groupBy('round_id')
      .count('round_id as total')
      .orderBy('order')

    return rounds.length + 1
  }

  private async getStatsByTeam(
    seasonId: number,
    teamId: number,
    currentRound: number,
    type: string
  ) {
    return await Round.query()
      .where('season_id', seasonId)
      .where('order', '<', currentRound)
      .preload('matches', (builder) => {
        builder
          .where('home_team_id', teamId)
          .orWhere('away_team_id', teamId)
          .preload('stats', (builder2) => {
            builder2.andWhere('type', type)
          })
      })
  }

  private async predictionByTeam(
    seasonId: number,
    teamId: number,
    currentRound: number,
    bet: number,
    type: string
  ) {
    const rounds = await this.getStatsByTeam(seasonId, teamId, currentRound, type)
    let sum = 0
    rounds.forEach((round) => {
      const value1 = round.matches.at(0)?.stats.at(0)?.value!
      const value2 = round.matches.at(0)?.stats.at(1)?.value!
      const value = value1 + value2
      if (value && value <= bet) sum += 1
    })
    return sum / rounds.length
  }

  public async predictionsByMatch(matchId: number, betValue: number, betType: string) {
    /**
     * buscar os 2 times teamId1 e teamId2
     * buscar a rodada = roundId
     * buscar a season = seasonId
     * const predTeam1 = Prediction.prediction1(seasonId, teamId1, roudId, betValue, betType)
     * const predTeam2 = Prediction.prediction1(seasonId, teamId2, roudId, betValue, betType)
     * pred = ((predTeam1 + predTeam2) / 2) * riscFactor
     * criar previsão no banco para a partida futura
     */
    const riscFact = 1
    const match = await Match.findOrFail(matchId)
    const round = await Round.findOrFail(match.roundId)
    const homeTeamPrediction = await this.predictionByTeam(
      round.seasonId,
      match.homeTeamId,
      match.roundId,
      betValue,
      betType
    )
    const awayTeamPrediction = await this.predictionByTeam(
      round.seasonId,
      match.awayTeamId,
      match.roundId,
      betValue,
      betType
    )

    // const matchPrediction = (riscFact * (homeTeamPrediction + awayTeamPrediction)) / 2

    return {
      matchId: match.id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeTeamPrediction,
      awayTeamPrediction,
      riscFact,
    }
  }
}

export default new Prediction()
