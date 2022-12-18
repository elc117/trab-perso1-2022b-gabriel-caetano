import fetch from 'node-fetch'
import Env from '@ioc:Adonis/Core/Env'

class ApiFootball {
  private baseUrl = 'https://api-football-v1.p.rapidapi.com/v3/'

  private async get(subUrl: string) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': Env.get('API_FOOTBALL_KEY'),
        'X-RapidAPI-Host': Env.get('API_FOOTBALL_HOST'),
      },
    }
    const data = await fetch(this.baseUrl + subUrl, options)
    return await data.json()
  }

  public async leaguesByCountry(country: string) {
    const subUrl = `/leagues?country=${country}`
    return await this.get(subUrl)
  }

  public async listCountries() {
    return await this.get('/countries')
  }

  public async listLeagues() {
    return await this.get('/leagues')
  }
}
export default new ApiFootball()
