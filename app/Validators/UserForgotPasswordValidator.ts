import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
  })

  public messages = {
    'email.required': 'Você deve informar um email.',
    'email.email': 'O email informado é inválido.',
  }
}
