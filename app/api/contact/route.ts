import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { contactSchema, escapeHtml } from '@/lib/validation';

function buildTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error('[contact] Credenciais SMTP não configuradas.');
  }

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    return {
      user,
      transporter: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE === 'true' || port === 465,
        auth: { user, pass },
      }),
    };
  }

  return {
    user,
    transporter: nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    }),
  };
}

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const rate = checkRateLimit(ip, {
    namespace: 'contact',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Limite de envios atingido. Tente novamente em alguns minutos.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos no formulário.',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, organization, inquiryType, message, interest, website } =
      parsed.data;

    // Honeypot preenchido por bot: responde 200 silenciosamente sem enviar e-mail
    if (website && website.trim().length > 0) {
      return NextResponse.json({ message: 'Email enviado com sucesso!' });
    }

    const { user, transporter } = buildTransporter();
    const recipient = process.env.CONTACT_TO_EMAIL || 'labriot.utfpr@gmail.com';

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeOrg = escapeHtml(organization || 'Não informada');
    const safeInquiry = escapeHtml(inquiryType || 'Não informado');
    const safeInterest = escapeHtml(interest || 'Não informado');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

    await transporter.sendMail({
      from: `"Site Labriot" <${user}>`,
      replyTo: email,
      to: recipient,
      subject: `[Labriot Contato] Nova mensagem de ${name.replace(/[\r\n]+/g, ' ')}`,
      text: [
        'Nova Mensagem de Contato - Labriot',
        `Nome: ${name}`,
        `Email: ${email}`,
        `Organização: ${organization || 'Não informada'}`,
        `Tipo de Consulta: ${inquiryType || 'Não informado'}`,
        `Área de Interesse: ${interest || 'Não informado'}`,
        '',
        'Mensagem:',
        message,
      ].join('\n'),
      html: `
        <h2>Nova Mensagem de Contato — Labriot</h2>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Organização:</strong> ${safeOrg}</p>
        <p><strong>Tipo de Consulta:</strong> ${safeInquiry}</p>
        <p><strong>Área de Interesse:</strong> ${safeInterest}</p>
        <hr />
        <p><strong>Mensagem:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('[contact] Erro ao enviar email:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}
