const sgMail = require('@sendgrid/mail');


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

