import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Sport from './Sport'
import Country from './Country'
import Season from './Season'

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

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Sport)
  public sport: BelongsTo<typeof Sport>

  @belongsTo(() => Country)
  public country: BelongsTo<typeof Country>

  @hasMany(() => Season)
  public seasons: HasMany<typeof Season>
}
