import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StatTypes extends BaseSchema {
  protected tableName = 'stat_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('name_pt').notNullable()
      table.string('slug').notNullable()
      table.boolean('active').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
