import type { APIRoute } from 'astro';
import { leadSchema } from '../../lib/forms';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json({ message: 'Некорректный формат заявки' }, 400);
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ message: 'Проверьте поля формы', issues: parsed.error.issues }, 400);
  }

  if (parsed.data.website) {
    return json({ message: 'Заявка принята' });
  }

  const { vin, ...safeLead } = parsed.data;
  const webhookUrl = import.meta.env.LEAD_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...safeLead, vinProvided: Boolean(vin) })
      });

      if (!response.ok) {
        console.error('Lead webhook failed', response.status);
      }
    } catch (error) {
      console.error('Lead webhook error', error);
    }
  } else {
    console.info('DynoCore lead simulation', {
      ...safeLead,
      vinProvided: Boolean(vin),
      receivedAt: new Date().toISOString()
    });
  }

  return json({
    message: 'Заявка принята. Мы подготовим расчет и свяжемся с вами в выбранном мессенджере.'
  });
};

export const GET: APIRoute = () => json({ message: 'Lead endpoint expects POST requests' }, 405);
