import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { transactionsRoutes } from './routes/transactionsRoutes'

export const app = fastify() // create a server

app.register(cookie) // register cookie to use in the server

app.register(transactionsRoutes, {
  prefix: 'transactions',
}) // register routes plugin
