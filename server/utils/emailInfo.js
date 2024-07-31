/**
 * 
 * emailInfo.js
 * 
 * Utility to get the email content
 * 
 */
const emailVerificationSubject = "Registration Email Verification"

function emailVerificationMessage(name, url) {

    return `
    <html>
        <head></head>
        <body>

        <h3> Hello ${name},</h3>
        <p> Thank you for your interest in using a11yAssessor. </p>
        <p> Click this <a href="${url}">verification link</a> to verify your email.</p>
        
        </body>
    </html>
    `
}

export default { emailVerificationSubject, emailVerificationMessage };
