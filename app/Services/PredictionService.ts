import Match from 'App/Models/Match'
import Prediction from 'App/Models/Prediction'
import Round from 'App/Models/Round'
import Season from 'App/Models/Season'
import { DateTime } from 'luxon'

class PredictionService {
  private getLastRoundEnd() {
    const today = DateTime.now()
    const { weekday } = today
    if (weekday === 2 || weekday === 5) return today
    else if (weekday > 2 && weekday < 5) {
      const diff = weekday - 2
      return today.plus({ days: -diff })
    } else if (weekday < 2) {
      const diff = weekday + 1
      return today.plus({ days: -diff })
    } else {
      // weekday = 6
      const diff = 1
      return today.plus({ days: -diff })
    }
  }

  public async getCurrentRound(leagueId: number) {
    let lastEnd = this.getLastRoundEnd()

    const season = await Season.query()
      .select('id')
      .where('league_id', leagueId)
      .andWhere('start_date', '<', lastEnd.toISODate())
      .andWhere('end_date', '>', lastEnd.toISODate())
      .firstOrFail()

    const lastRound = await Round.query()
      .select(['rounds.*', 'm.round_id'])
      .leftJoin('matches as m', 'm.round_id', 'rounds.id')
      .where('season_id', season.id)
      .where('m.date', '<', lastEnd.toISODate())
      .orderBy('order', 'desc')
      .firstOrFail()
    return lastRound.order + 1
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
    const predictions = await Prediction.query()
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
    predictions.sort((a: Prediction, b: Prediction) => {
      const matchA = a.$preloaded.match as Match
      const matchB = b.$preloaded.match as Match
      if (matchA.date < matchB.date) return -1
      if (matchA.date > matchB.date) return 1
      else return 0
    })
    return predictions
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

    const filteredRounds = rounds.filter((round) => !!round.matches.at(0)?.stats.at(0)?.value)
    filteredRounds.forEach((round) => {
      const value1 = round.matches.at(0)?.stats.at(0)?.value!
      const value2 = round.matches.at(0)?.stats.at(1)?.value!
      const value = value1 + value2
      if (underOver === 'under' && value && value <= bet) sum += 1
      if (underOver === 'over' && value && value > bet) sum += 1
    })
    return sum / filteredRounds.length
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
    try {
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
    } catch (e) {
      console.log(e)
    }
  }
}

export default new PredictionService()
