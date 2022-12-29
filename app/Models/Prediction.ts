import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Match from './Match'
import StatType from './StatType'

export default class Prediction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public matchId: number

  @column()
  public statTypeId: number

  @column()
  public homeTeamPrediction: number

  @column()
  public awayTeamPrediction: number

  @column()
  public matchPrediction: number

  @column()
  public manualRisc: number

  @column()
  public underOver: string //from enum ['under', 'over']

  @column()
  public betValue: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Match)
  public match: BelongsTo<typeof Match>

  @belongsTo(() => StatType)
  public statType: BelongsTo<typeof StatType>
}
