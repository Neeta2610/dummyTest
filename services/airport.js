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
        var equipments = await db.collection('equipments')
            .find()
            .toArray()
        equipments.forEach(e => {
            console.log(e.img);
            if (typeof e.img == "string") {
                e.img = `${config.backend_url}/${config.img_path}/${e.img}`
            }
            else {
                console.log(true);
                let arr = []
                e.img.forEach(i => {
                    console.log(i);
                    i = `${config.backend_url}/${config.img_path}/${i}`
                    arr.push(i)
                })
                e.img = arr
                // console.log(e.img);
            }
        })
        // console.log("equipments : ", equipments);
        obj = { feedbackData: filteredData, galleryData: gallery, servicesData: services, logos: logos, equipments: equipments }
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
        const db = getDb()
        var result = await db.collection("users")
            .find({ "email": req.body.email })
            .toArray();
        console.log(result);
        if (result[0].email == req.body.email && result[0].password == req.body.password) {

            res.send({ status: true, isAdmin: result[0].isAdmin })
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
                isAdmin: false
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

exports.saveRecord = async (req, res) => {
    try {
        console.log("recordsave  accessed", req.body);
        const db = getDb();
        await db.collection('equipments')
            .updateOne({ _id: req.body.id }, { $set: { date: new Date() } })
        let record = await db.collection('equipments')
            .find({ '_id': req.body.id })
            .toArray()
        console.log(record);
        let modified_date = formatDate(record[0].date)
        res.send(200, { modified_date: modified_date })
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

exports.equipmentRecord = async (req, res) => {
    try {
        console.log("equipments accessed", req.query, req.body);
        const db = getDb();
        let record = await db.collection('equipments')
            .find({ _id: req.query.id })
            .toArray()
        console.log("record :::>>>> ", record);
        record.forEach(e => {
            console.log("e.img  -->> ", e.img);
            if (typeof e.img == "string") {
                e.img = `${config.backend_url}/${config.img_path}/${e.img}`
            }
            else {
                console.log(true);
                let arr = []
                e.img.forEach(i => {
                    // console.log(i);
                    i = `${config.backend_url}/${config.img_path}/${i}`
                    arr.push(i)
                })
                e.img = arr
                // console.log(e.img);
            }
        })

        console.log("result > ", record[0]);
        res.send({ data: record[0] })
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

exports.equipPage = async (req, res) => {
    try {
        console.log("equipments accessed", req.query);
        const db = getDb();
        let record = await db.collection('equipments')
            .find({ '_id': req.query.id })
            .toArray()
        record.forEach(e => {
            // console.log(e.img);
            if (typeof e.img == "string") {
                e.img = `${config.backend_url}/${config.img_path}/${e.img}`
            }
            else {
                console.log(true);
                let arr = []
                e.img.forEach(i => {
                    // console.log(i);
                    i = `${config.backend_url}/${config.img_path}/${i}`
                    arr.push(i)
                })
                // console.log(e.img);
                e.img = arr[1]
            }

            e.date = e.date ? formatDate(e.date) : "No Records Found"
        })
        console.log(record[0]);
        res.render('equip-record', { data: record[0] })
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

function dateToYMD(date) {
    console.log(date);
    var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return '' + (d <= 9 ? '0' + d : d) + ',' + m + ',' + y + " " + hours + ":" + minutes + ":" + seconds;
}

function formatDate(date) {
    console.log(date, new Date(date));
    // date = new Date(2021, 4, 15, 14, 20, 36, 0);
    let d1 = new Date(date);
    let d2 = new Date();
    let difference = d2.getTime() - d1.getTime()
    let seconds = Math.floor(difference / 1000)
    let minutes = Math.round((difference / 60000))
    let hours = Math.round(difference / 3600000)
    let dayOfMonth = d1.getDate();
    let month = d1.getMonth() + 1;
    let year = d1.getFullYear();
    // console.log("date is ",d1,d2);


    if (seconds <= 60) {
        // console.log("seconds",seconds);
        return `${seconds} seconds ago`;
    }
    else if (minutes <= 60) {
        // console.log("minutes",minutes);
        if (minutes == 1) { return `${minutes} minute ago`; }
        else { return `${minutes} minutes ago`; }
    }
    else if (hours <= 24) {
        // console.log("hours",hours);
        if (hours == 1) { return `${hours} hour ago` }
        else { return `${hours} hours ago` }
    }
    else {
        console.log(year, month - 1, dayOfMonth, hours, minutes, seconds);
        let dateformtted = new Date(year, month, dayOfMonth, hours, minutes, seconds); // 1 Jan 2011, 00:00:00
        // date = this.datePipe.transform(d1, "d MMM , y, h:mm:ss a");
        console.log("date->", dateToYMD(dateformtted));

        return `${dateToYMD(dateformtted)}`;
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
                    subject: 'Daily Newsletter from Airport Jammu Satwari',
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