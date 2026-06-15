import { z } from 'zod'

export const CreateRoleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().optional(),
  description: z.string().optional(),
})

export const UpdateRoleSchema = CreateRoleSchema.partial()

export const RoleQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
})

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>
export type RoleQuery = z.infer<typeof RoleQuerySchema>