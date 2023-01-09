import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import { DateTime } from 'luxon'

export default class CustomersController {
  public async index({ auth }: HttpContextContract) {
    const yesterday = DateTime.now().plus({ days: -1 })
    const user = auth.user!
    const customer = await Customer.findOrFail(user.id)
    if (customer.active && customer.planDueDate < yesterday) {
      customer.active = false
      await customer.save()
    }
    return {
      email: user.email,
      name: customer.name,
      active: customer.active,
      planDueDate: customer.planDueDate,
    }
  }
}
