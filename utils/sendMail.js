const config = require('../config.json');
const configSMTP = require('../config.json').smtp_config;
const configHandlebars = require('../config.json').handlebars;
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');


exports.sendMail = function (emailObj) {
    console.log('email obj is - > ', emailObj);

    var transporter = nodemailer.createTransport({
        host: configSMTP.host,
        secure: true, // use SSL
        auth: {
            user: configSMTP.auth.user, // neeta
            pass: configSMTP.auth.pass, //pwd
        },
    });

    var mailOptions = {
        from: emailObj.from,
        to: emailObj.to,
        subject: emailObj.subject,
        template: emailObj.template
    };

    if (emailObj.hbsFileName) {
        const handlebarOptions = {
            viewEngine: {
                extName: configHandlebars.options.extName,
                partialsDir: configHandlebars.options.viewEngine.partialsDir,
                layoutsDir: configHandlebars.options.viewEngine.layoutsDir,
                defaultLayout: emailObj.hbsFileName,
            },
            viewPath: configHandlebars.options.viewPath,
            extName: configHandlebars.options.extName,
        };

        transporter.use('compile', hbs(handlebarOptions));
        mailOptions.context = emailObj.context
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log('Email sent: ', info.response);
            return info.res
        }
    });
    transporter.close();
};