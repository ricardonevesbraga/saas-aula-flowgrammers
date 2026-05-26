import { z } from 'zod'

export const BUSINESS_CATEGORIES = [
  'Lanchonete', 'Cafeteria', 'Restaurante', 'Padaria',
  'Salão de Beleza', 'Barbearia', 'Petshop', 'Farmácia',
  'Mercado', 'Academia', 'Clínica', 'Oficina Mecânica', 'Outro'
] as const

export const businessSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(150, 'Nome muito longo'),
  category: z.enum(BUSINESS_CATEGORIES, { error: 'Selecione uma categoria' }),
  thank_you_message: z.string().max(200, 'Máximo 200 caracteres').optional(),
  address: z.string().max(300, 'Endereço muito longo').optional(),
})

export type BusinessFormData = z.infer<typeof businessSchema>
