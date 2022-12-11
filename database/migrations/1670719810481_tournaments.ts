import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tournaments extends BaseSchema {
  protected tableName = 'tournaments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sport_id')
      table.integer('sofascore_id')
      table.string('name')
      table.string('slug')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}