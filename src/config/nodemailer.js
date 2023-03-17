const { createTransport } = require ('nodemailer');
const vars = require ('./config');
const { TEST_MAIL } = vars;


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: 'ywFkCDVuw36gThTJ3t'
    }
});

module.exports = transporter;