import fetch from 'node-fetch'

export default class SofascoreService {
  private baseUrl = 'https://api.sofascore.com/api/v1'
  public async callTest1() {
    const url = `${this.baseUrl}/event/10411607/statistics`
    return (await fetch(url)).text()
  }

  public async statsByEventId(eventId: string) {
    const url = `${this.baseUrl}/event/${eventId}/statistics`
    return (await fetch(url)).json()
  }

  public async eventById(eventId: string) {
    const url = `${this.baseUrl}/event/${eventId}`
    return (await fetch(url)).json()
  }

  public async listTeams() {
    const url = `${this.baseUrl}unique-tournament/23/season/42415/standings/total`
    return (await fetch(url)).json()
  }

  public async getUniqueTournaments() {
    const url = `${this.baseUrl}/config/unique-tournaments/BR`
    const data = await fetch(url)
    const jsonData = JSON.parse(await data.text())
    return jsonData
  }

  // teste
  public async webConfig() {
    const url = `${this.baseUrl}/config/unique-tournaments/BR`
    return (await fetch(url)).text()
  }

  public async listSports() {
    const url = this.baseUrl + '/sport/-10800/event-count'
    return (await fetch(url)).text()
  }

  public async web() {
    const url = this.baseUrl + '/odds/providers/BR/web'
    return (await fetch(url)).text()
  }

  public async uniqueTournaments() {
    const url = this.baseUrl + '/calendar/2022-12/-10800/football/unique-tournaments'
    return (await fetch(url)).text()
  }

  public async trendingTopPlayers() {
    const url = this.baseUrl + '/sport/football/trending-top-players'
    return (await fetch(url)).text()
  }

  public async newlyAddedEvents() {
    const url = this.baseUrl + '/event/newly-added-events'
    return (await fetch(url)).text()
  }

  public async football() {
    const url = this.baseUrl + '/odds/1/featured-events/football'
    return (await fetch(url)).text()
  }

  public async footballConf() {
    const url = this.baseUrl + '/config/unique-tournaments/BR/football'
    return (await fetch(url)).text()
  }

  public async featured() {
    const url = this.baseUrl + '/event/10919691/odds/1/featured'
    return (await fetch(url)).text()
  }
}
