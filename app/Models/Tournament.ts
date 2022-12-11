import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Sport from './Sport'

export default class Tournament extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sportId: number

  @column()
  public sofascoreId: number

  @column()
  public name: string

  @column()
  public slug: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Sport)
  public sport: BelongsTo<typeof Sport>
}
