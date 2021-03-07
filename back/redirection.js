

const express   = require("express")
const http      = require("http")
const requestIp = require("request-ip")
const fs        = require("fs")
const ejs       = require("ejs")
const {con}     = require("./conf/mysql.js")
const socketIO  = require("socket.io")



const CONF = JSON.parse( fs.readFileSync("./conf.json") )

/////////////////////////////////////////////
//conf express and socket.io
let redirectApp = express()
let consoleApp  = express()




http.createServer(redirectApp).listen(CONF.redirect.port)
//https ?

let server = http.createServer(consoleApp).listen(CONF.console.port)
//socket IO
let io = socketIO.listen(server)


checkValide(url)
{
  let date = new Date(url)
  return ( Date.now() - date ) 
}

function getLinks(req){
  return new Promise((resolve, reject)=>{
  
    let options = {
      redirect : "",
      sendLinks: "",
      time: 1000,
    }


    console.log(`NEW USER IP => ${requestIp.getClientIp(req)} IS LANDING ON PAGE => ${req.url}`)

    io.emit("NewConnection", {ip: requestIp.getClientIp(req), url: req.originalUrl})

    con.query("SELECT TO_URL FROM WHERE FROM_URL=?", req.path, (err, result, fields)=>{
      
      //ERROR CHECK
      if(err){reject( {err: "error not url found"})}
      if(!result.lenght){reject({err: "error not url found"})}
      if(!checkValide(result[0].ENDTIME)){reject({err: "error url not valide"})}
      
      //SUCCESS 
      options.TIME = result[0].TIME
      options.redirect = result[0].TO_URL

      let url = `http://${CONF.console.host}:${CONF.console.port}/send/${result.UUID}`
      options.sendLinks = url
      
      resolve(options)
    })



  })
}


redirectApp.use(async (req, res)=>{
  try{
    let options = await getLinks(req)
    
    res.render("landing.ejs", options);
  }
  catch(error)
  {
    res.redirect(CONF.redirect.default)
  }
})



//////////////////////////////////////////
///Console 

const {checkIp} = require("./tools/checkIP.js")

consoleApp.use(express.json({limit: "10mB"}))
consoleApp.use(express.urlencoded({extended: true}))
consoleApp.use(requestIp.mw())

function pushNewUser(user)
{
  return new Promise((resolve, reject)=>{     

    con.query("INSERT INTO user SET ?", user, (err)=>{
      if(err){reject({err: err})}
      io.emit("newUserInfo", user)
      resolve("ok")
    })

  })
}

consoleApp.post("/send/:UUID", async (req, res)=>{
    try{
      if(req.params.UUID ){throw {err: "bad request"} }
      let user = {
        date      : new Date(),
        ip        : req.clientIp,
        navigator : res.body.navigator || "NULL",
        os        : res.body.os || "NULL",
        UUID      : req.params.UUID || "NULL",
      }

      let responsse = await pushNewUser(user)
      res.status(200).json({res: responsse})
    }
    catch(err){
      err = err.err || "bad request"
      res.status(500).json({err: err.err})
    }
  }
)


function getInformationByUUID(UUID)
{
  return new Promise((resolve, reject)=>{
      con.query(`SELECT * FROM user 
      INNER JOIN redirect ON user.UUID = redirect.UUID 
      WHERE UUID = ?`, [UUID], (err, result, fileds)=>{
        if(err){reject({err: "error please try again"})}
        if(!result.lenght){reject({err: "error please try again"})}
        resolve(result);
      })
  })
}


consoleApp.get("/getByUIDD/:UUID", checkIp,  async (req, res)=>{
    try{
      if(req.params.UUID){throw {err: "please entry your UUID"}}
      let result = await getInformationByUUID(req.params.UUID)
      res.render("UUID.ejs", result)

    } 
    catch(err)
    {
      err = err.err || "plesse try again"
      res.status(500).json({err: err})
    } 
  }
)


function getByUUID()
{
  return new Promise((resolve, reject)=>{
    con.query("SELECT * FROM redirect", (err, result, fields)=>{
      if(err){reject({err: "bad request"})}
      if(!result.lenght){reject({err: "error"})}
    })
  })
}



consoleApp.get("/HOME", checkIp, async (req, res)=>{
    try{
        let result = await getByUUID()
        res.render("home.ejs", result)
    }
    catch(err){
      err = err.err || "error please try again"
      res.status(500).json({err: err})
    }
  }
)


consoleApp.get("")
consoleApp.post("")