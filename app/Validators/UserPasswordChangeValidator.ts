import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserPasswordChangeValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    newPassword: schema.string({}, [
      //rules.confirmed(),
      rules.minLength(6),
    ]),
  })

  public messages = {
    'newPassword.required': 'Você deve informar uma senha nova.',
    'newPassword.minLength': 'Para sua segurança, a senha deve possuir pelo menos 6 digitos.',
    //'newPassword.confirmed': 'As senhas digitadas não conferem.'
  }
}
