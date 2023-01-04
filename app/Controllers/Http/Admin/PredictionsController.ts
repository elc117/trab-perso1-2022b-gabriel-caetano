import Prediction from 'App/Services/PredictionService'

export default class PredictionController {
  public async generatePredictions() {
    const cornerValues = [12.5, 11.5, 10.5, 9.5, 8.5]
    // const cardsValues = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5]
    for (const value of cornerValues) {
      await Prediction.generatePredictionsByLeague(8, value, 8, 'under')
      await Prediction.generatePredictionsByLeague(8, value, 8, 'over')
    }
  }
}
