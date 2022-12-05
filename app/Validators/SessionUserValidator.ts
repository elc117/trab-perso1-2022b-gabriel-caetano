import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    //fields are required by default when '.optional' is not included
    email: schema.string({}, [rules.email()]),
    password: schema.string(),
  })

  public messages = {
    'email.required': 'Você deve informar um email.',
    'email.email': 'O email informado é inválido.',
    'password.required': 'Você deve informar uma senha',
  }
}
