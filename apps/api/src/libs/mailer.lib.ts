import nodemailer, { type SendMailOptions , type Transporter } from "nodemailer";
import env from "../config/env.js";

const transporter: Transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.secure, // true for 465, false for other ports
})

export interface sendEmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export const sendEmail = async ({
    to,
    subject,
    text,
    html,
}: sendEmailOptions): Promise<void> => {
    const options: SendMailOptions = {
        from: env.emailFrom,
        to,
        subject,
        ...(text ? { text } : {}),
        ...(html ? { html } : {}),
    };

    await transporter.sendMail(options);
};

export const verifyMailerConnection = async (): Promise<boolean> => {
    return transporter.verify()
}