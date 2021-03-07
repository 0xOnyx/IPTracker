


let ipAuth = new Map([
    ["", 0],
    ["", 0] 
])


let checkIP = (req, res, next)=>{
    if(!ipAuth.has(req.clientIp)){
        res.status(43).json({err: "FORBIDDEN"})
    }
    else{
        next()
    } 
}