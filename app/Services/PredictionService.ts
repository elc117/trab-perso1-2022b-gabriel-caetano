import Match from 'App/Models/Match'
import Prediction from 'App/Models/Prediction'
import Round from 'App/Models/Round'
import Season from 'App/Models/Season'
import { DateTime } from 'luxon'

class PredictionService {
  public async getCurrentRound(leagueId: number) {
    const today = DateTime.now().toISO()
    const season = await Season.query()
      .select('id')
      .where('league_id', leagueId)
      .where('start_date', '<', today)
      .andWhere('end_date', '>', today)
      .firstOrFail()

    const rounds = await Round.query()
      .select(['rounds.*', 'm.round_id'])
      .leftJoin('matches as m', 'm.round_id', 'rounds.id')
      .where('season_id', season.id)
      .where('m.date', '<', today)
      .groupBy('round_id')
      .count('round_id as total')
      .orderBy('order')

    return rounds.length + 1
  }

  private async getMatchesByRound(roundId: number) {
    const matches = []

    return matches
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
    const awayFact = (1 - awayTeamPrediction) / 10
    const homeFact = (1 - homeTeamPrediction) / 10
    const riscFact = 1 - (awayFact + homeFact / 2)
    const manualRisc = 1 // manually changed when needed

    return {
      matchId: match.id,
      homeTeamPrediction,
      awayTeamPrediction,
      matchPrediction: ((homeTeamPrediction + awayTeamPrediction) / 2) * riscFact,
      manualRisc,
    }
  }

  public async generatePredictionsByLeague(leagueId: number, betValue: number, betType: string) {
    /**
     * get current round from league
     * get matches from round
     * get predictionsByMatch
     * save all predictions
     */
    const currentRound = await this.getCurrentRound(leagueId)
    const matches = await this.getMatchesByRound(currentRound)
    const predictions: Prediction[] = []
    for (const match of matches) {
      // get match prediction
    }

    Prediction.createMany(predictions)
  }
}

export default new PredictionService()
