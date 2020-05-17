const sgMail = require('@sendgrid/mail');

const sgAPIKey = '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';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        'to': email,
        'from': 'bprathesh@gmail.com',
        'subject': 'Welcome to the APP',
        'text': `Hi ${name}, Thanks for joing with us.`
    });
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        'to': email,
        'from': 'bprathesh@gmail.com',
        'subject': 'Cancelling Account',
        'text': `Hi ${name}, you have cancelled your account. Hope you enjoyed our service.`
    });
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}

