import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Match from './Match'
import Team from './Team'
import StatType from './StatType'

export default class Stat extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public matchId: number

  @column()
  public teamId: number

  @column()
  public statTypeId: number // from enum

  @column()
  public period: string // from enum ['total', 'first', 'second']

  @column()
  public value: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Match)
  public match: BelongsTo<typeof Match>

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @belongsTo(() => StatType)
  public statType: BelongsTo<typeof StatType>
}
