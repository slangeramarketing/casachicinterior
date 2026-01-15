import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // true only for 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});


export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  return mailer.sendMail({
    from: process.env.MAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
