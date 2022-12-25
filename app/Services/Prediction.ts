import Round from 'App/Models/Round'

class Prediction {
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
            builder2.where('team_id', teamId).andWhere('type', type)
          })
      })
  }

  public async prediction1(
    seasonId: number,
    teamId: number,
    currentRound: number,
    bet: number,
    type: string
  ) {
    const rounds = await this.getStatsByTeam(seasonId, teamId, currentRound, type)
    let sum = 0
    rounds.forEach((round) => {
      const value = round.matches.at(0)?.stats.at(0)?.value
      if (value && value <= bet) sum += 1
    })
    return sum / rounds.length
  }
}

export default new Prediction()
