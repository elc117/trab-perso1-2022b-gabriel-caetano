import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public userId: number

  @column()
  public name: string

  @column()
  public verificationCode: string | null

  @column()
  public verified: boolean

  @column()
  public active: boolean

  @column.dateTime()
  public planDueDate: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
