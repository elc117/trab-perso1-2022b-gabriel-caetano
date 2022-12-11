import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tournaments extends BaseSchema {
  protected tableName = 'tournaments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('sport_id')
        .unsigned()
        .references('id')
        .inTable('sports')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('sofascore_id').notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
