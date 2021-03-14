


let ipAuth = ["::1"]


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