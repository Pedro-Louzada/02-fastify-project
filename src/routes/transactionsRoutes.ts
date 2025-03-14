import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return reply.status(200).send({ transactions })
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      })
      // params são os parâmetros da url
      const { id } = getTransactionParamsSchema.parse(request.params)
      /*
    utilizando o método first para retornar somente o primeiro, neste caso
    ao invés de retornar um array retornaria somente o objeto
    */
      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return reply.status(200).send({ transaction })
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      /*
    método sum, soma a coluna selecionada como um todo
    utilizando o fisrt sempre quando não desejo que o knex me retorne um array
    e dentro do sum como 2º param, passo que a soma ficará guardada em uma
    propriedade chamada amount
    */
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return reply.status(200).send({ summary })
    },
  )

  // calling the method
  app.post('/', async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionSchema.parse(request.body)
    // consultando o cookie
    let { sessionId } = request.cookies

    if (!sessionId) {
      sessionId = randomUUID()
      // cadastrando o cookie
      reply.setCookie('sessionId', sessionId, {
        // caminho onde poderemos enxergar o cookie
        path: '/',
        // tempo de expiração do cookie
        maxAge: 60 * 24 * 7, // 7 dias
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
