import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RoleUsers extends BaseSchema {
  protected tableName = 'role_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id').unsigned().index()
      table.foreign('role_id').references('roles.id').onDelete('cascade')
      table.integer('user_id').unsigned().index()
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
