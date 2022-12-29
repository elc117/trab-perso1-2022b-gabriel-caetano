import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Predictions extends BaseSchema {
  protected tableName = 'predictions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .enum('under_over', ['under', 'over'])
        .notNullable()
        .defaultTo('under')
        .after('stat_type_id')
      table.decimal('bet_value', 5, 1).notNullable().after('under_over')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('under_over')
      table.dropColumn('bet_value')
    })
  }
}
