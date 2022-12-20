import fetch from 'node-fetch'
import Env from '@ioc:Adonis/Core/Env'

class ApiFootball {
  private apiHost = Env.get('API_FOOTBALL_HOST')
  private baseUrl = `https://${this.apiHost}/v3`

  private async get(subUrl: string) {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': Env.get('API_FOOTBALL_KEY'),
        'X-RapidAPI-Host': this.apiHost,
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

  public async listTeamsByLeagueAndSeason(league: number, season: number) {
    return await this.get(`/teams?league=${league}&season=${season}`)
  }
}
export default new ApiFootball()
