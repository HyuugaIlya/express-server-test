import nodemailer from 'nodemailer'

import SMTPTransport from 'nodemailer/lib/smtp-transport'

export type TMail = {
    to: string,
    subject: string,
    html: string
}
export const emailService = {
    async sendEmail(
        to: string,
        subject: string,
        html: string
    ): Promise<SMTPTransport.SentMessageInfo | void> {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: 'lev4enko.ilia@mail.ru',
                    pass: 'xbRApd0yzQiQXhU71BZt'
                }
            })

            const msg = {
                from: "ItIsMe <lev4enko.ilia@mail.ru>",
                to,
                subject,
                html,
            }

            const mail = await transporter.sendMail(msg)
            return mail
        } catch (error) {
            return
        }
    },
}