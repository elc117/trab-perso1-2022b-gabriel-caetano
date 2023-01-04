import Match from 'App/Models/Match'
import Prediction from 'App/Models/Prediction'
import Round from 'App/Models/Round'
import Season from 'App/Models/Season'
import { DateTime } from 'luxon'

class PredictionService {
  private async getCurrentRound(leagueId: number) {
    const today = DateTime.now().toISO()
    const season = await Season.query()
      .select('id')
      .where('league_id', leagueId)
      .andWhere('start_date', '<', today)
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
    return await Match.query().where('round_id', roundId)
  }

  public async listPredictions(
    leagueId: number,
    statId: number,
    betValue: number,
    underOver: string
  ) {
    const round = await this.getCurrentRound(leagueId)
    const matches = await this.getMatchesByRound(round)
    return await Prediction.query()
      .whereIn(
        'match_id',
        matches.map((match) => match.id)
      )
      .andWhere('stat_type_id', statId)
      .andWhere('bet_value', betValue)
      .andWhere('under_over', underOver)
      .preload('match', (builder) => {
        builder.preload('awayTeam').preload('homeTeam')
      })
  }

  private async getStatsByTeam(
    seasonId: number,
    teamId: number,
    currentRound: number,
    type: number
  ) {
    return await Round.query()
      .where('season_id', seasonId)
      .where('order', '<', currentRound)
      .preload('matches', (builder) => {
        builder
          .where('home_team_id', teamId)
          .orWhere('away_team_id', teamId)
          .preload('stats', (builder2) => {
            builder2.andWhere('stat_type_id', type)
          })
      })
  }

  private async predictionByTeam(
    seasonId: number,
    teamId: number,
    currentRound: number,
    bet: number,
    type: number,
    underOver: string
  ) {
    const rounds = await this.getStatsByTeam(seasonId, teamId, currentRound, type)
    let sum = 0
    rounds.forEach((round) => {
      const value1 = round.matches.at(0)?.stats.at(0)?.value!
      const value2 = round.matches.at(0)?.stats.at(1)?.value!
      const value = value1 + value2
      if (underOver === 'under' && value && value <= bet) sum += 1
      if (underOver === 'over' && value && value > bet) sum += 1
    })
    return sum / rounds.length
  }

  private async predictionsByMatch(
    matchId: number,
    betValue: number,
    betType: number,
    underOver: string
  ): Promise<Prediction> {
    const match = await Match.findOrFail(matchId)
    const round = await Round.findOrFail(match.roundId)
    const homeTeamPrediction = await this.predictionByTeam(
      round.seasonId,
      match.homeTeamId,
      match.roundId,
      betValue,
      betType,
      underOver
    )
    const awayTeamPrediction = await this.predictionByTeam(
      round.seasonId,
      match.awayTeamId,
      match.roundId,
      betValue,
      betType,
      underOver
    )
    const awayFact = (1 - awayTeamPrediction) / 10
    const homeFact = (1 - homeTeamPrediction) / 10
    const riscFact = 1 - (awayFact + homeFact / 2)
    const manualRisc = 1 // manually changed when needed

    const prediction = new Prediction()
    prediction.merge({
      matchId: match.id,
      homeTeamPrediction,
      awayTeamPrediction,
      matchPrediction: ((homeTeamPrediction + awayTeamPrediction) / 2) * riscFact,
      manualRisc,
      underOver,
      betValue,
      statTypeId: betType,
    })
    return prediction
  }

  private async checkOldPrediction(
    matchId: number,
    betValue: number,
    betType: number,
    underOver: string
  ) {
    const oldPrediction = await Prediction.query()
      .where('match_id', matchId)
      .andWhere('under_over', underOver)
      .andWhere('bet_value', betValue)
      .andWhere('stat_type_id', betType)
      .first()
    if (oldPrediction) return true
    return false
  }

  public async generatePredictionsByLeague(
    leagueId: number,
    betValue: number,
    betType: number,
    underOver: string
  ) {
    const currentRound = await this.getCurrentRound(leagueId)
    const matches = await this.getMatchesByRound(currentRound)
    const predictions: Prediction[] = []
    for (const match of matches) {
      const exist = await this.checkOldPrediction(match.id, betValue, betType, underOver)
      if (!exist) {
        const prediction = await this.predictionsByMatch(match.id, betValue, betType, underOver)
        predictions.push(prediction)
      }
    }
    await Prediction.createMany(predictions)
  }
}

export default new PredictionService()
