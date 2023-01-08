import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import ActiveCustomerValidator from 'App/Validators/ActiveCustomerValidator'
import { DateTime } from 'luxon'

export default class CustomersController {
  public async activate({ request, response }: HttpContextContract) {
    const { customerId, daysToAdd } = await request.validate(ActiveCustomerValidator)
    const customer = await Customer.findOrFail(customerId)
    try {
      if (customer.active) {
        const planDueDate = customer.planDueDate.plus({ days: daysToAdd })
        customer.merge({ planDueDate })
        await customer.save()
      } else {
        const planDueDate = DateTime.now().plus({ days: daysToAdd })
        customer.merge({ active: true, planDueDate })
        await customer.save()
      }
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        message: 'Houve um problema com a requisição, por favor tente novamente mais tarde.',
      })
    }
  }
}
