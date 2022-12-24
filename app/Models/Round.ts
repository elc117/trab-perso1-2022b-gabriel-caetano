import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Season from './Season'

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
}
