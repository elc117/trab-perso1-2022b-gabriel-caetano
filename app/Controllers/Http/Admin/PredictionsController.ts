import Prediction from 'App/Services/PredictionService'

export default class PredictionController {
  public async generatePredictions() {
    await Prediction.generatePredictionsByLeague(8, 12.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 11.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 10.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 9.5, 8, 'under')
    await Prediction.generatePredictionsByLeague(8, 8.5, 8, 'under')
  }
}
