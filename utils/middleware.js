

module.exports = async function (req, res, next) {
console.log("this is middleware",req);
next();
}