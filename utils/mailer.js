import nodemailer from "nodemailer";

// configuration for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    },
});


export const sendMail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: `"InstaLoanX" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        // console.log("Email: mailer.js", info);
        // console.log('Email sent: %s', info.messageId);
        return info;
    } catch (err) {
        console.error('Error sending email:', err);
        throw err;
    }
};