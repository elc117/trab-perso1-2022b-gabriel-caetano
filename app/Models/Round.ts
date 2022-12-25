import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Season from './Season'
import Match from './Match'

export default class Round extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public seasonId: number

  @column()
  public name: string

  @column()
  public order: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Season)
  public season: BelongsTo<typeof Season>

  @hasMany(() => Match)
  public matches: HasMany<typeof Match>
}
