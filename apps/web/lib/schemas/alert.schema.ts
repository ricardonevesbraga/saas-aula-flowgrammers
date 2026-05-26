import { z } from 'zod'

export const alertConfigSchema = z.object({
  threshold_rating: z.number().int().min(1).max(5),
  enabled: z.boolean(),
})

export type AlertConfigFormData = z.infer<typeof alertConfigSchema>
