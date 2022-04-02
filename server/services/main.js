const getDb = require('../utils/dbconnection').getDb;
const ObjectId = require('mongodb').ObjectId;
const config = require('../config.json');
const email = require('../utils/sendMail');
// const scheduler = require('../scheduler.js');

exports.getData = async (req, res) => {
    try {
        console.log("json accessed");
        const db = getDb();

        var result = await db.collection("dummy")
                    .find()
                    .toArray();
                console.log(result);
        res.render('main', { data:JSON.stringify(result,null,4)})
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

// exports.loginPage = async (req, res) => {
//     try {
//         res.render('login', { data: "Hello",url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.loginPageMain = async (req, res) => {
//     try {
//         res.render('login-page', { data: "Hello",url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.confirmBooking = async (req, res) => {
//     try {
//         res.render('confirm-booking', { data: "Hello",url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.loggedIn = async (req, res) => {
//     try {
//         console.log("logged in : ", req.body);
//         const db = getDb()
//         var result = await db.collection("users")
//             .find({ "email": req.body.email })
//             .toArray();
//         console.log(result);
//         if (result[0].email == req.body.email && result[0].password == req.body.password) {

//             res.send({ status: true, isAdmin: result[0].isAdmin })
//         }
//         else {
//             res.send({ status: true, isAdmin:false,invalid:true })
//         }
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.about = async (req, res) => {
//     try {
//         res.render('about', { url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.aboutLogin = async (req, res) => {
//     try {
//         res.render('about-login', { url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.getservices = async (req, res) => {
//     try {
//         const db = getDb();

//         // to get services 
//         var services = await db.collection('services')
//             .find()
//             .toArray()

//         res.render('services', { url:config.backend_url,servicesData: services })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.getgallery = async (req, res) => {
//     try {
//         const db = getDb();

//        // to get gallery data
//        var gallery = await db.collection('gallery')
//        .find()
//        .toArray()
//    // console.log("json data : ", filteredData);
//    gallery.forEach(element => {
//        element.img = `${config.backend_url}/${config.img_path}/${element.img}`
//    });
//         res.render('gallery', { url:config.backend_url, galleryData: gallery })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.ticketHome = async (req, res) => {
//     try {
//         res.render('ticket-home', { url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.payment = async (req, res) => {
//     try {
//         res.render('payment', { url:config.backend_url })
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// exports.register = async (req, res) => {
//     try {
//         console.log("register : ", req.body);
//         let pwd = makePassword()
//         const db = getDb()
//         const result = await db.collection("users")
//             .find({ "email": req.body.email }, { $exists: true })
//             .toArray();
//         if (result && result.length > 0) {
//             res.send({ status: false, msg: "Email Address is already registered" })
//         }
//         req.body.isAdmin = false;
//         await db.collection('users')
//             .insertOne(req.body).then(async result => {
//                 if (result) {
//                     console.log(true);
//                     res.send({ status: true })
//                 }
//                 else {
//                     console.log(false);
//                 }
//             })

//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }


// exports.services = async (req, res) => {
//     try {
//         // console.log("services accessed" , req.query);
//         const db = getDb();
//         // to get services 
//         var service = await db.collection('services')
//             .find({ type: req.query.type })
//             .toArray()
//         // console.log("service : ",service);
//         res.send(service)
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }

// function dateToYMD(date) {
//     console.log(date);
//     var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     var d = date.getDate();
//     var m = strArray[date.getMonth()];
//     var y = date.getFullYear();
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     let seconds = date.getSeconds();
//     return '' + (d <= 9 ? '0' + d : d) + ',' + m + ',' + y + " " + hours + ":" + minutes + ":" + seconds;
// }

// function formatDate(date) {
//     console.log(date, new Date(date));
//     // date = new Date(2021, 4, 15, 14, 20, 36, 0);
//     let d1 = new Date(date);
//     let d2 = new Date();
//     let difference = d2.getTime() - d1.getTime()
//     let seconds = Math.floor(difference / 1000)
//     let minutes = Math.round((difference / 60000))
//     let hours = Math.round(difference / 3600000)
//     let dayOfMonth = d1.getDate();
//     let month = d1.getMonth() + 1;
//     let year = d1.getFullYear();
//     // console.log("date is ",d1,d2);


//     if (seconds <= 60) {
//         // console.log("seconds",seconds);
//         return `${seconds} seconds ago`;
//     }
//     else if (minutes <= 60) {
//         // console.log("minutes",minutes);
//         if (minutes == 1) { return `${minutes} minute ago`; }
//         else { return `${minutes} minutes ago`; }
//     }
//     else if (hours <= 24) {
//         // console.log("hours",hours);
//         if (hours == 1) { return `${hours} hour ago` }
//         else { return `${hours} hours ago` }
//     }
//     else {
//         console.log(year, month - 1, dayOfMonth, hours, minutes, seconds);
//         let dateformtted = new Date(year, month, dayOfMonth, hours, minutes, seconds); // 1 Jan 2011, 00:00:00
//         // date = this.datePipe.transform(d1, "d MMM , y, h:mm:ss a");
//         console.log("date->", dateToYMD(dateformtted));

//         return `${dateToYMD(dateformtted)}`;
//     }

// }


// exports.insertEmail = async (req, res) => {
//     try {
//         const db = getDb()
//         console.log("insert email accessed ", req.query);
//         const result = await db.collection("subscribed_users")
//             .find({ "email": req.query.email }, { $exists: true })
//             .toArray();
//         if (result && result.length > 0) {
//             res.send({ message: "fail", data: "Email Address already exists" })
//         }
//         else {
//             let sEmails = req.query.email.split("@");
//             let doaminsplit = sEmails[1].split('.');
//             //console.log('splitedurl: ', splitedurl);
//             console.log(sEmails);
//             let name = sEmails[0]
//             var obj = {
//                 hbsFileName: 'subscribeTemplate.handlebars',
//                 from: 'asodekarneeta@gmail.com',
//                 to: req.query.email,
//                 subject: 'NewsLetter Subscription',
//                 template: 'subscribeTemplate',
//                 context: {
//                     title: ' Hi ' + name,
//                     css: "css/style.css"
//                 }
//             };
//             await db.collection('subscribed_users')
//                 .insertOne({
//                     email: req.query.email,
//                     limit_exceeded: false
//                 })
//                 .then(async result => {
//                     console.log(true)
//                     // //console.log(obj);
//                     await email.sendMail(obj)
//                     res.send({ message: "success", data: "You have been subscribed to our daily newsletters" })
//                 })
//         }
//     }
//     catch (err) {
//         console.log(err);
//         return err;
//     }
// }




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