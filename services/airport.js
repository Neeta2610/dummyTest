const getDb = require('../utils/dbconnection').getDb;
const ObjectId = require('mongodb').ObjectId;
const config = require('../config.json');
const email = require('../utils/sendMail');
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

exports.loginPage = async (req, res) => {
    try {
        res.render('login', { data: "Hello" })
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

exports.loggedIn = async (req, res) => {
    try {
        console.log("logged in : ", req.body);
        const db=getDb()
        var result = await db.collection("users")
            .find({ "email": req.body.email })
            .toArray();
            console.log(result);
        if (result[0].email == req.body.email && result[0].password == req.body.password) {
            res.send({ status: true })
        }
        else {
            res.send({ status: false })
        }
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

exports.register = async (req, res) => {
    try {
        console.log("register : ", req.body);
        let pwd = makePassword()
        const db = getDb()
        const result = await db.collection("users")
            .find({ "email": req.body.email }, { $exists: true })
            .toArray();
        if (result && result.length > 0) {
            res.send({ status: false, msg: "Email Address is already registered" })
        }
        await db.collection('users')
            .insertOne({
                name: req.body.name,
                email: req.body.email,
                password: pwd,
                isAdmin: true
            }).then(async result => {
                if (result) {
                    console.log(true);
                    var obj = {
                        hbsFileName: 'passwordTemplate.handlebars',
                        from: 'asodekarneeta@gmail.com',
                        to: req.body.email,
                        subject: 'Registration Successful',
                        template: 'passwordTemplate',
                        context: {
                            name: req.body.name,
                            password: pwd,
                            css: "css/style.css"
                        }
                    };
                    await email.sendMail(obj)
                    res.send({ status: true })
                }
                else {
                    console.log(false);
                }
            })
        l
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
        const result = await db.collection("subscribed_users")
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
            await db.collection('subscribed_users')
                .insertOne({
                    email: req.query.email,
                    limit_exceeded: false
                })
                .then(async result => {
                    console.log(true)
                    // //console.log(obj);
                    await email.sendMail(obj)
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
        var users = await db.collection('subscribed_users')
            .find()
            .toArray()
        var newsletters = await db.collection('newsletters')
            .find()
            .toArray()

        users.forEach(async item => {
            console.log("item : ", item);
            // let count = item.count
            if (item.limit_exceeded != undefined && item.limit_exceeded) {
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
                await email.sendMail(obj);
                await db.collection('subscribed_users')
                    .updateOne({ email: item.email }, { $set: { limit_exceeded: true } })
            }
        })
    }


    catch (err) {
        console.log(err);
        return err;
    }

}




function onExit() {
    try {
        console.log("exit now");
        process.kill(process.pid, 'SIGTERM')
    }
    catch (err) {
        console.log(err);
    }
}


function makePassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

    return text;
}