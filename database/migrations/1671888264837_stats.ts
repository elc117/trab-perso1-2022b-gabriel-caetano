import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Stats extends BaseSchema {
  protected tableName = 'stats'

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
        .integer('team_id')
        .unsigned()
        .references('id')
        .inTable('teams')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .enum('type', [
          'Shots on Goal',
          'Shots off Goal',
          'Total Shots',
          'Blocked Shots',
          'Shots insidebox',
          'Shots outsidebox',
          'Fouls',
          'Corner Kicks',
          'Offsides',
          'Ball Possession',
          'Yellow Cards',
          'Red Cards',
          'Goalkeeper Saves',
          'Total passes',
          'Passes accurate',
          'Passes %',
        ])
        .notNullable()
      table.integer('value').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
