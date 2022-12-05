import test from 'japa'
import { JSDOM } from 'jsdom'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('/sessions', () => {
  test('admin login', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/sessions')
      .send({ email: 'gcmazzardo@inf.ufsm.br', password: '123' })
      .expect(200)

    assert.equal(body.auth.type, 'bearer')
  })
})
