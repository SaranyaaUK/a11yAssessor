/**
 * 
 * emailInfo.js
 * 
 * Utility to get the email content
 * 
 */

//  Verification Email content
const emailVerificationSubject = "a11yassessor Email Verification"

function emailVerificationMessage(name, url) {

    return `
    <html>
        <head></head>
        <body>
            <h3> Hello ${name},</h3>
            <p> Thank you for registering with a11yAssessor. 
                Click on the link below to verify your email: 
            </p>
            <p> ${url}</p>
            <p>This link will expire in 24 hours. 
                If you did not sign up for a a11yAssessor account, 
                you can safely ignore this email.
            </p>
            <p>Best,</p>
            <p>The a11yAssessor Team</p>
        </body>
    </html>
    `
}

// Password reset Email content
const passwordResetSubject = "a11yassessor Password Reset"

function passwordResetMessage(name, url) {

    return `
    <html>
        <head></head>
        <body>
            <h3> Hello ${name},</h3>
            <p> Click the link below to reset your account password.</p>
            <p> ${url}</p>
            <p>This link will expire in 1 hour. 
                If you did not request a password reset for your a11yAssessor account,
                you can ignore this email.</p>
            <p>Best,</p>
            <p>The a11yAssessor Team</p>
        </body>
    </html>
    `
}
export default {
    emailVerificationSubject,
    emailVerificationMessage,
    passwordResetSubject,
    passwordResetMessage
};
