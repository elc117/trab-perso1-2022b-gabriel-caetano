import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rounds extends BaseSchema {
  protected tableName = 'rounds'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('season_id')
        .unsigned()
        .references('id')
        .inTable('seasons')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name').notNullable()
      table.integer('order').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
