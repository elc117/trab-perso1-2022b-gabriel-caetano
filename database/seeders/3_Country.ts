import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'
import apiFootball from 'App/Services/ApiFootball'
import slugify from 'slugify'

export default class CountrySeeder extends BaseSeeder {
  public async run() {
    const countriesData = await apiFootball.listCountries()
    const countries: Country[] = []
    countriesData.response.forEach((countryData) => {
      const newCountry = new Country()
      const slug = slugify(countryData.name).toLowerCase()
      newCountry.merge({
        ...countryData,
        slug,
      })
      countries.push(newCountry)
    })
    await Country.createMany(countries)
  }
}
