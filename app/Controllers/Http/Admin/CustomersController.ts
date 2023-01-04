import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import ActiveCustomerValidator from 'App/Validators/ActiveCustomerValidator'

export default class CustomersController {
  public async activate({ request }: HttpContextContract) {
    const { customerId } = await request.validate(ActiveCustomerValidator)
    const customer = await Customer.findOrFail(customerId)
    if (!customer.active) {
      customer.merge({ active: true })
      await customer.save()
    }
  }
}
