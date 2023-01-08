import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ActiveCustomerValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    customerId: schema.number([
      rules.exists({
        // number in the array must be a valid customer id
        table: 'customers',
        column: 'user_id',
      }),
    ]),
    daysToAdd: schema.number(),
  })

  public messages = {
    'customerId.required': 'Você deve selecionar um usuário.',
    'customerId.exists': 'O usuário selecionado é inválido.',
    'daysToAdd.required': 'Você deve informar quantos dias de plano adicionar.',
  }
}
