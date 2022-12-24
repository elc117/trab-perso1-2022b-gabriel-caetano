import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roundId: number

  @column()
  public homeTeamId: number

  @column()
  public awayTeamId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Team, {
    localKey: 'homeTeamId',
    foreignKey: 'id',
  })
  public homeTeam: HasOne<typeof Team>

  @hasOne(() => Team, {
    localKey: 'awayTeamId',
    foreignKey: 'id',
  })
  public awayTeam: HasOne<typeof Team>
}
