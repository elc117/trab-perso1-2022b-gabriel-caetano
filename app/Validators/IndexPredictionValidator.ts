import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IndexPredictionValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    leagueId: schema.number([
      rules.exists({
        // number in the array must be a valid league id
        table: 'leagues',
        column: 'id',
      }),
    ]),
    betValue: schema.number(),
    statType: schema.number([
      rules.exists({
        // number in the array must be a valid league id
        table: 'stat_types',
        column: 'id',
      }),
    ]),
    underOver: schema.enum(['under', 'over']),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'leagueId.required': 'Você deve selecionar uma liga.',
    'leagueId.exists': 'A liga selecionada é inválida.',
    'betValue.required': 'Você deve informar o valor de referência da aposta.',
    'statType.required': 'Você deve informar a estatística da aposta.',
    'statType.exists': 'A estatística da aposta é inválida.',
    'underOver.required': 'Você deve informar se a aposta é maior que ou menor que.',
    'underOver.enum': 'Opção de maior que ou menor que inválida.',
  }
}
