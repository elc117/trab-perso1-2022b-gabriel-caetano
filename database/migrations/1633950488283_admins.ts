import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Admins extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('user_id')
        .unsigned()
        .primary()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .unique()
        .notNullable()
      table.string('name').notNullable()
      table.string('sector')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
