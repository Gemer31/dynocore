import { useEffect, useState } from 'react';
import { CallChannelIcon, MessengerIcon, messengerLabels } from '../icons/MessengerIcon';
import { readUtmParams, trackEvent } from '../../lib/analytics';
import { leadSchema } from '../../lib/forms';

type FormValues = {
  brand: string;
  model: string;
  engine: string;
  year: string;
  phone: string;
  messenger: 'telegram' | 'viber' | 'phone';
  comment: string;
  consent: boolean;
  website: string;
};

const initialValues: FormValues = {
  brand: '',
  model: '',
  engine: '',
  year: '',
  phone: '',
  messenger: 'telegram',
  comment: '',
  consent: false,
  website: ''
};

export default function LeadForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUtm(readUtmParams());
  }, []);

  const updateField = (name: keyof FormValues, value: string | boolean) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const submit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const payload = {
      ...values,
      consent: values.consent,
      page: window.location.pathname,
      utm
    };
    const parsed = leadSchema.safeParse(payload);

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[issue.path[0]?.toString() ?? 'form'] = issue.message;
      }
      setErrors(nextErrors);
      setStatus('error');
      setMessage('Проверьте поля формы.');
      trackEvent({ name: 'lead_form_validation_error' });
      return;
    }

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? 'Не удалось отправить заявку');
      }

      setValues(initialValues);
      setErrors({});
      setStatus('success');
      setMessage(data.message ?? 'Заявка принята. Мы свяжемся с вами.');
      trackEvent({ name: 'lead_form_submit', params: { goal: parsed.data.goal } });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Не удалось отправить заявку. Напишите в мессенджер.');
      trackEvent({ name: 'lead_form_error' });
    }
  };

  const inputClass =
    'focus-ring w-full rounded-xl border border-white/10 bg-ink/70 px-4 py-3 text-sm text-text placeholder:text-muted/70 transition focus:border-blue';

  return (
    <form id="lead-form" className="glass rounded-3xl p-5 md:p-7" onSubmit={submit} noValidate>
      <div className="mb-6">
        <h2 className="mt-2 text-2xl font-extrabold text-text md:text-3xl">Оставить заявку</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Обычно отвечаем в рабочее время в течение 15 минут.
        </p>
      </div>

      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        name="website"
        value={values.website}
        onChange={(event) => updateField('website', event.target.value)}
        aria-hidden="true"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Марка
          <input className={`${inputClass} mt-2`} value={values.brand} onChange={(event) => updateField('brand', event.target.value)} placeholder="BMW" />
          {errors.brand && <span className="mt-1 block text-xs text-red-300">{errors.brand}</span>}
        </label>
        <label className="block text-sm font-semibold">
          Модель
          <input className={`${inputClass} mt-2`} value={values.model} onChange={(event) => updateField('model', event.target.value)} placeholder="X5, A6, Passat" />
          {errors.model && <span className="mt-1 block text-xs text-red-300">{errors.model}</span>}
        </label>
        <label className="block text-sm font-semibold">
          Двигатель
          <input className={`${inputClass} mt-2`} value={values.engine} onChange={(event) => updateField('engine', event.target.value)} placeholder="2.0 TDI, 3.0d, 2.0 TFSI" />
          {errors.engine && <span className="mt-1 block text-xs text-red-300">{errors.engine}</span>}
        </label>
        <label className="block text-sm font-semibold">
          Год
          <input className={`${inputClass} mt-2`} value={values.year} onChange={(event) => updateField('year', event.target.value)} placeholder="2018" inputMode="numeric" />
          {errors.year && <span className="mt-1 block text-xs text-red-300">{errors.year}</span>}
        </label>
        <label className="block text-sm font-semibold">
          Телефон или ник
          <input className={`${inputClass} mt-2`} value={values.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+375..." />
          {errors.phone && <span className="mt-1 block text-xs text-red-300">{errors.phone}</span>}
        </label>
        <div className="block text-sm font-semibold">
          <span className="block">Удобный канал</span>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Удобный канал связи">
            {(
              [
                { value: 'telegram' as const, messenger: 'telegram' as const },
                { value: 'viber' as const, messenger: 'viber' as const }
              ] as const
            ).map(({ value, messenger }) => (
              <label
                key={value}
                className={`focus-ring inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border transition ${
                  values.messenger === value ? 'border-blue bg-blue/15 text-blue' : 'border-white/10 text-muted hover:border-white/20 hover:text-text'
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="messenger"
                  value={value}
                  checked={values.messenger === value}
                  onChange={() => updateField('messenger', value)}
                />
                <MessengerIcon messenger={messenger} className="h-5 w-5" />
                <span className="sr-only">{messengerLabels[value]}</span>
              </label>
            ))}
            <label
              className={`focus-ring inline-flex h-11 min-w-[7.5rem] cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 transition ${
                values.messenger === 'phone' ? 'border-blue bg-blue/15 text-blue' : 'border-white/10 text-muted hover:border-white/20 hover:text-text'
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="messenger"
                value="phone"
                checked={values.messenger === 'phone'}
                onChange={() => updateField('messenger', 'phone')}
              />
              <CallChannelIcon className="h-5 w-5 shrink-0" />
              <span className="text-xs font-bold text-text">{messengerLabels.phone}</span>
            </label>
          </div>
          {errors.messenger && <span className="mt-1 block text-xs text-red-300">{errors.messenger}</span>}
        </div>
      </div>

      <label className="mt-4 block text-sm font-semibold">
        Комментарий
        <textarea className={`${inputClass} mt-2 min-h-28`} value={values.comment} onChange={(event) => updateField('comment', event.target.value)} placeholder="Цель обращения, симптомы, ошибки" />
      </label>

      <label className="mt-5 flex gap-3 text-sm leading-6 text-muted">
        <input
          className="mt-1 h-4 w-4 rounded border-white/20 bg-ink"
          type="checkbox"
          checked={values.consent}
          onChange={(event) => updateField('consent', event.target.checked)}
        />
        <span>Согласен на обработку данных для связи по заявке.</span>
      </label>
      {errors.consent && <span className="mt-1 block text-xs text-red-300">{errors.consent}</span>}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="focus-ring rounded-full bg-blue px-6 py-3 text-sm font-extrabold text-white shadow-glow transition hover:bg-blue/90 disabled:cursor-not-allowed disabled:opacity-70" disabled={status === 'loading'}>
          {status === 'loading' ? 'Отправляем...' : 'Отправить'}
        </button>
        <p className="text-xs leading-5 text-muted">Форма защищена honeypot-полем. Внешние CRM/боты подключаются через env без хранения секретов на клиенте.</p>
      </div>

      {message && (
        <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${status === 'success' ? 'border-success/30 bg-success/10 text-green-200' : 'border-red-300/30 bg-red-950/30 text-red-200'}`} aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}
