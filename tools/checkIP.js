


let ipAuth = ["::1", "35.191.14.12", "35.191.14.12", "35.191.14.11", "35.191.3.131"]


let checkIP = (req, res, next)=>{
    console.log(req.clientIp)

    // if(!ipAuth.includes(req.clientIp)){
    //     res.status(403).json({err: "FORBIDDEN"})
    // }
    // else{
        next()
    //} 
}


exports.checkIp = checkIP