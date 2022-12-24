import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import League from './League'

export default class Season extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public leagueId: number

  @column()
  public year: number

  @column.dateTime()
  public startDate: DateTime

  @column.dateTime()
  public endDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => League)
  public league: BelongsTo<typeof League>
}
