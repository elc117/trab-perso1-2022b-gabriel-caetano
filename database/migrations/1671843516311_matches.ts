import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Matches extends BaseSchema {
  protected tableName = 'matches'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('round_id')
        .unsigned()
        .references('id')
        .inTable('rounds')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('home_team_id')
        .unsigned()
        .references('id')
        .inTable('teams_seasons')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('away_team_id')
        .unsigned()
        .references('id')
        .inTable('teams_seasons')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.date('date').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
