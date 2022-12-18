import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Sport from './Sport'
import Country from './Country'

export default class League extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sportId: number

  @column()
  public countryId: number

  @column()
  public apiFootballId: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public logoUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Sport)
  public sport: BelongsTo<typeof Sport>

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>
}
