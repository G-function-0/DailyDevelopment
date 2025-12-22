
function sendError(res,code,message){
    return res.status(code).json({
        success : false,
        message
    })
}

module.exports = sendError ;