import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { env } from './config/env'
import { AppError } from './shared/errors'
import { ZodError } from 'zod'
import { authRoutes } from './modules/auth/auth.routes'

export function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty' }
          : undefined,
    },
  })

  // ─── Plugins ───────────────────────────────────────────
  app.register(cors, {
    origin: true,
    credentials: true,
  })

  app.register(jwt, {
    secret: env.JWT_SECRET,
  })

  // ─── Global error handler ──────────────────────────────
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        code: error.code,
        message: error.message,
      })
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: error.flatten().fieldErrors,
      })
    }

    app.log.error(error)
    return reply.status(500).send({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    })
  })

  // ─── Health check ──────────────────────────────────────
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  app.register(authRoutes, { prefix: '/api/v1/auth' })

  return app
}