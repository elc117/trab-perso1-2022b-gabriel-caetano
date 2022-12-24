import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Country from './Country'
import Sport from './Sport'
import Season from './Season'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public apiFootballId: number

  @column()
  public countryId: number

  @column()
  public sportId: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public code: string

  @column()
  public founded: number

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

  @manyToMany(() => Season)
  public seasons: ManyToMany<typeof Season>
}
