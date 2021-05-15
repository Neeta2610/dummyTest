module.exports.response = function (resp, status, statuscode, message, data) {
    var obj = {}
    obj.status = status || false
    obj.statuscode = statuscode || 500
    obj.message = message || 'internal server error'
    obj.data = data || {}
    resp.status(statuscode).send(obj);
}