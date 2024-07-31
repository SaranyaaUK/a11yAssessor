/**
 * 
 *  sendEmail.js
 * 
 *  Utility to initiate email from the application
 *  
 */

import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

async function sendEmail(toEmail, subject, message) {
    console.log("sendEmail utility");

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            port: 587,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorised: false,
            },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: toEmail,
            subject: subject,
            html: message,
        })

        console.log("Email sent");

    } catch (error) {
        console.log("Sending email failed. Please verify the email entered");
        console.log(error);
        return error;
    }

}

export default sendEmail;