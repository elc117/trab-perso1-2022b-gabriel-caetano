import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'

export default class CustomersController {
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!
    const customer = await Customer.findOrFail(user.id)
    return {
      email: user.email,
      name: customer.name,
      active: customer.active,
    }
  }
}
