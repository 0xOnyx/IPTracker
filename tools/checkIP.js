


let ipAuth = ["::1", "::ffff:192.168.1.202"]


let checkIP = (req, res, next)=>{
    console.log(req.clientIp)

    if(!ipAuth.includes(req.clientIp)){
        res.status(403).json({err: "FORBIDDEN"})
    }
    else{
        next()
    } 
}


exports.checkIp = checkIP