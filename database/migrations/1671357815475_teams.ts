import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Teams extends BaseSchema {
  protected tableName = 'teams'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('api_football_id').notNullable()
      table
        .integer('country_id')
        .unsigned()
        .references('id')
        .inTable('countries')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('sport_id')
        .unsigned()
        .references('id')
        .inTable('sports')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.string('code').notNullable()
      table.integer('founded')
      table.string('logo_url').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
