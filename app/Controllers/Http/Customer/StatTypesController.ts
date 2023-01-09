// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import StatType from 'App/Models/StatType'

export default class StatTypesController {
  public async index() {
    const types = await StatType.query()
    return types.map((type) => {
      return {
        id: type.id,
        name: type.name,
        namePt: type.namePt,
        slug: type.slug,
        active: type.active,
      }
    })
  }
}
