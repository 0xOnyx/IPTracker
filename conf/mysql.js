
//////////////////////////////////
//Configuration mysql


//CREATE USER "ext"@"localhost" IDENTIFIED BY "MTIzNDU2Nw=="
//6.tcp.ngrok.io:14715

const fs    = require("fs")
const mysql = require("mysql")
const conf  = require("./conf.json")



var con = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  database: conf.database,
  port: conf.port,
});


con.connect((err)=>{
  if(err){return console.error("MYSQL ERROR => " + err)}
  console.log("MYSQL CONNNECTION => OK " )
})



exports.con = con

//////////////////////////////////////////