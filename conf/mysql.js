
//////////////////////////////////
//Configuration mysql


//CREATE USER "ext"@"localhost" IDENTIFIED BY "MTIzNDU2Nw=="
//6.tcp.ngrok.io:14715

const fs    = require("fs")
const mysql = require("mysql")




let conf = fs.readFileSync("./conf/conf.json")

conf = JSON.parse(conf);

console.log(conf)

/*
{
  "user"    : "ext",
  "password": "MTIzNDU2Nw==",
  "host"    : "3.132.159.158",
  "database": "IpTracker",
  "port"    : 14715 
}
*/

//https://www.npmjs.com/package/mysql

var con = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  database: conf.d////////////
  port: conf.port,//////
});

console.log()


// con.connect((err)=>{
//   if(err){return console.error("MYSQL ERROR => " + err)}
//   console.log("MYSQL CONNNECTION => OK " )
// })

con.connect(function(err) {
  if (err) console.log(err);
  console.log("MYSQL CONNNECTION => OK");
})



exports.con = con

//////////////////////////////////////////