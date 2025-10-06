// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, organization, inquiryType, message, interest } = await request.json();

    // Crie um transportador do nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou outro provedor de e-mail
      auth: {
        user: process.env.EMAIL_USER, // Seu e-mail do Gmail
        pass: process.env.EMAIL_PASS, // A senha de aplicativo do seu e-mail
      },
    });

    const mailOptions = {
      from: email,
      to: 'labriot.utfpr@gmail.com',
      subject: `Nova mensagem de contato de ${name}`,
      html: `
        <h1>Nova Mensagem de Contato</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organização:</strong> ${organization}</p>
        <p><strong>Tipo de Consulta:</strong> ${inquiryType}</p>
        <p><strong>Área de Interesse:</strong> ${interest}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error(error);
    return new Response('Ocorreu um erro ao enviar o email.', { status: 500 });
  }
}