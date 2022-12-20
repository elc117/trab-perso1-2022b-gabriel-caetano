import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import League from './League'

export default class Sport extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @hasMany(() => League)
  public leagues: HasMany<typeof League>
}
