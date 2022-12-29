import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Predictions extends BaseSchema {
  protected tableName = 'predictions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('match_id')
        .unsigned()
        .references('id')
        .inTable('matches')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('stat_type_id')
        .unsigned()
        .references('id')
        .inTable('stat_types')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.float('home_team_prediction').notNullable()
      table.float('away_team_prediction').notNullable()
      table.float('match_prediction').notNullable()
      table.float('manual_risc').notNullable().defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
