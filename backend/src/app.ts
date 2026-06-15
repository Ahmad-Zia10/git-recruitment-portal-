import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { env } from './config/env'
import { AppError } from './shared/errors'
import { ZodError } from 'zod'
import { authRoutes } from './modules/auth/auth.routes'
import { companyRoutes } from './modules/companies/companies.routes'
import { roleRoutes } from './modules/roles/role.routes'
import { jobOpeningRoutes } from './modules/job-openings/job-opening.routes'
import { candidateRoutes } from './modules/candidates/candidate.route'
import { applicationRoutes } from './modules/applications/application.routes'
import { billingRoutes } from './modules/billing/billing.routes'
import { dashboardRoutes } from './modules/dashboard/dashboard.routes'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'

export async function buildApp() {
  const app = Fastify({
    logger:
      env.NODE_ENV === 'production'
        ? true
        : {
            transport: {
              target: 'pino-pretty',
              options: { colorize: true },
            },
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

  // ─── Rate limiting ─────────────────────────────────────
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please slow down',
    }),
  })

  // ─── Security headers ──────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
  })

  // ─── Global error handler ──────────────────────────────
  app.setErrorHandler((error:any, request, reply) => {
  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please slow down',
    })
  }

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

  app.register(companyRoutes, { prefix: '/api/v1/companies' })

  app.register(roleRoutes, { prefix: '/api/v1/roles' })

  app.register(jobOpeningRoutes, { prefix: '/api/v1/job-openings' })

  app.register(candidateRoutes, { prefix: '/api/v1/candidates' })

  app.register(applicationRoutes, { prefix: '/api/v1/applications' })

  app.register(billingRoutes, { prefix: '/api/v1/billing' })

  app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' })

  return app
}