import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import ActiveCustomerValidator from 'App/Validators/ActiveCustomerValidator'
import { DateTime } from 'luxon'

export default class CustomersController {
  public async activate({ request }: HttpContextContract) {
    const { customerId } = await request.validate(ActiveCustomerValidator)
    const customer = await Customer.findOrFail(customerId)
    const today = DateTime.now().toISODate()
    if (!customer.active) {
      customer.merge({ active: true, dueDate: today })
      await customer.save()
    }
  }
}
