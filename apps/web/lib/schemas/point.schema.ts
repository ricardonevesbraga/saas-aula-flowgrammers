import { z } from 'zod'

export const pointSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(100, 'Nome muito longo'),
})

export type PointFormData = z.infer<typeof pointSchema>
