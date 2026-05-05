import { z } from 'zod';

export const leadSchema = z.object({
  brand: z.string().trim().min(2, 'Укажите марку автомобиля').max(80),
  model: z.string().trim().min(1, 'Укажите модель').max(80),
  engine: z.string().trim().min(1, 'Укажите двигатель').max(80),
  year: z.string().trim().regex(/^(19|20)\d{2}$/, 'Укажите корректный год'),
  goal: z.string().trim().min(3, 'Выберите цель обращения').max(120),
  phone: z.string().trim().min(7, 'Укажите телефон или мессенджер').max(40),
  messenger: z.enum(['telegram', 'viber', 'whatsapp', 'phone']),
  vin: z.string().trim().max(80).optional().or(z.literal('')),
  comment: z.string().trim().max(700).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Нужно согласие на обработку данных' }),
  website: z.string().max(0).optional().or(z.literal('')),
  page: z.string().trim().max(200).optional(),
  utm: z.record(z.string(), z.string()).optional()
});

export type LeadPayload = z.infer<typeof leadSchema>;
