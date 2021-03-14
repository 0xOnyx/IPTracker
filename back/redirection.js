

const express   = require("express")
const http      = require("http")
const requestIp = require("request-ip")
const fs        = require("fs")
const ejs       = require("ejs")
const {con}     = require("./conf/mysql.js")
const socketIO  = require("socket.io")
const {v4: uuidv4} = require("uuid")


const CONF = JSON.parse( fs.readFileSync("./conf.json") )

/////////////////////////////////////////////
//conf express and socket.io
let redirectApp = express()
let consoleApp  = express()




http.createServer(redirectApp).listen(CONF.redirect.port)
//https ?

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
    }


    console.log(`NEW USER IP => ${requestIp.getClientIp(req)} IS LANDING ON PAGE => ${req.url}`)

    

    con.query("SELECT TO_URL, UUID FROM WHERE FROM_URL=?", req.path, (err, result, fields)=>{
      
      //ERROR CHECK
      if(err){reject( {err: "error not url found"})}
      if(!result.lenght){reject({err: "error not url found"})}
      if(!checkValide(result[0].ENDTIME)){reject({err: "error url not valide"})}
      
      //SUCCESS 
      options.TIME = result[0].TIME
      options.redirect = result[0].TO_URL

      let url = `http://${CONF.console.host}:${CONF.console.port}/send/${result.UUID}`
      options.sendLinks = url
      
      io.emit(result.UUID + "Connection", {ip: requestIp.getClientIp(req), url: req.originalUrl})

      resolve(options)
    })



  })
}


redirectApp.all(async (req, res)=>{
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

//pour les fichier static
consoleApp.use("/static", express.static("public"))

function pushNewUser(user)
{
  return new Promise((resolve, reject)=>{     

    con.query("INSERT INTO user SET ?", user, (err)=>{
      if(err){reject({err: err})}
      io.emit(user.UUID + "Info", user)
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
      resolve(result)
    })
  })
}



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

function createUrl(options)
{
  return new Promise((resolve, reject)=>{
    let insert = {
        FROM_URL  : options.CustomURL,
        TO_URL    : options.Link,
        ENDTIME   : options.Time,
        UUID      : uuidv4(),
    }

    con.query("INSERT INTO redirect SET ?", insert, (err)=>{
      if(err){reject({err: "please try again"})}
      resolve(insert.UUID)
    })
  }

}

consoleApp.post("/create/links", checkIp, async(req)=>{
    try{
      if(!L_Link || !L_CustomURL)
        {throw {err: "bad request"}}

      if(!req.body.L_Time)
      {
        let date = new Date()

        date.setDate(date.getDate() + req.body.L_Time)
      }

        let create = {
          Link: req.body.L_Link,
          CustomURL: req.body.CustomURL,
          Time: date,
          options: {
            cam: req.body.L_came ? True : False,
            gps: req.body.L_gps  ? True : False,
            dehashed: req.body.L_dehashed  ? True : False,
            file: req.body.file  ? True : False,
          }

         }

         let UUID = await createUrl(options)

         res.render("YourCode.ejs")

    }
    catch(err){
      err = err || "please try again"
      res.status(500).json({err: err})
    }
})


