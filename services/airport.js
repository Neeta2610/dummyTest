const getDb = require('../utils/dbconnection').getDb;
const ObjectId = require('mongodb').ObjectId;
const { response } = require('../utils/response');
const config = require('../config.json');
const configSMTP = require('../config.json').smtp_config;
const configHandlebars = require('../config.json').handlebars;
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
// const scheduler = require('../scheduler.js');

exports.airportData = async (req, res) => {
    try {
        console.log("json accessed");
        const db = getDb();

        // to get reviews
        var feedback = await db.collection('airport')
            .find()
            .toArray()
        let filteredData = feedback.filter(i => parseInt(i.overall_rating) == 9)

        // to get gallery data
        var gallery = await db.collection('gallery')
            .find()
            .toArray()
        // console.log("json data : ", filteredData);
        gallery.forEach(element => {
            element.img = `${config.backend_url}/${config.img_path}/${element.img}`
        });

        // to get services 
        var services = await db.collection('services')
            .find()
            .toArray()

        var logos = await db.collection('logos')
            .find()
            .toArray()
        logos.forEach(element => {
            element.logo = `${config.backend_url}/${config.img_path}/${element.logo}`
        });
        obj = { feedbackData: filteredData, galleryData: gallery, servicesData: services, logos: logos }
        // console.log(obj);
        res.render('main', { data: obj })
    }
    catch (err) {
        console.log(err);
        return err;
    }
}


exports.services = async (req, res) => {
    try {
        // console.log("services accessed" , req.query);
        const db = getDb();
        // to get services 
        var service = await db.collection('services')
            .find({ type: req.query.type })
            .toArray()
        // console.log("service : ",service);
        res.send(service)
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

exports.insertEmail = async (req, res) => {
    try {
        const db = getDb()
        console.log("insert email accessed ", req.query);
        const result = await db.collection("users")
            .find({ "email": req.query.email }, { $exists: true })
            .toArray();
        if (result && result.length > 0) {
            res.send({ message: "fail", data: "Email Address already exists" })
        }
        else {
            let sEmails = req.query.email.split("@");
            let doaminsplit = sEmails[1].split('.');
            //console.log('splitedurl: ', splitedurl);
            console.log(sEmails);
            let name = sEmails[0]
            var obj = {
                hbsFileName: 'subscribeTemplate.handlebars',
                from: 'asodekarneeta@gmail.com',
                to: req.query.email,
                subject: 'NewsLetter Subscription',
                template: 'subscribeTemplate',
                context: {
                    title: ' Hi ' + name,
                    css: "css/style.css"
                }
            };
            await db.collection('users')
                .insertOne({
                    email: req.query.email,
                    limit_exceeded:false
                })
                .then(async result => {
                    console.log(true)
                    // //console.log(obj);
                    await this.sendMail(obj)
                    res.send({ message: "success", data: "You have been subscribed to our daily newsletters" })
                })
        }
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

exports.newsletters = async function (db) {
    try {
        // const db = getDb()
        var users = await db.collection('users')
            .find()
            .toArray()
        var newsletters = await db.collection('newsletters')
            .find()
            .toArray()

        users.forEach(async item => {
            console.log("item : ",item);
            // let count = item.count
            if (item.limit_exceeded!=undefined && item.limit_exceeded) {
                onExit();
            }
            else {
                // console.log("count : ",count);
                var obj = {
                    hbsFileName: 'emailTemplate.handlebars',
                    from: 'asodekarneeta@gmail.com',
                    to: item.email,
                    subject: 'Daily Newsletter from Airways',
                    template: 'emailTemplate',
                    context: {
                        title: newsletters[0].title,
                        snippet: newsletters[0].snippet,
                        link: newsletters[0].link
                    }
                };
                await this.sendMail(obj);
                await db.collection('users')
                    .updateOne({ email: item.email }, { $set: { limit_exceeded:true } })
            }
        })
    }


    catch (err) {
        console.log(err);
        return err;
    }

}

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
            return error
            // return responseData(info, true, 400, 'Error in Sending Email', { error });
        } else {
            console.log('Email sent: ', info.response);
            // return responseData(info, true, 200, 'Email Sent', { info });
            return info.res
        }
    });
    transporter.close();
};



function onExit() {
    try {
        console.log("exit now");
        process.kill(process.pid, 'SIGTERM')
    }
    catch (err) {
        console.log(err);
    }
}
