const { Client } = require("cassandra-driver");
var  cookieparser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var express = require('express');
var SHA512 = require('crypto-js/sha512');
var dotenv = require('dotenv');
var cors = require('cors');

dotenv.config()
var app = express();
var upload = multer();
const client = new Client({
    cloud: { secureConnectBundle: __dirname+ `/secure/secure-connect-${process.env.db}.zip` },
    credentials: { username: `${process.env.username}`, password: `${process.env.password}` }
  });

var appPort=process.env.PORT||8080;
var cookieTimeout=1; //in minutes
// var hashName    = SHA512(Name).toString();
// var hashPass    = SHA512(Pass).toString();
// var hashCookie  = SHA512(seed).toString();

app.use(cors())
app.use(cookieparser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array()); 
app.use(express.static('public'));
  
  app.post('/login',(request,response)=> { 
    if(Object.keys(request.cookies).length===0){
        auth(request.body.email,request.body.password).then((stat) =>{
            let hashCookie=SHA512(`${request.body.email}${(new Date()).toUTCString()}`).toString()
        addcookie(request.body.email,hashCookie);
        response.cookie('auth',hashCookie,{maxAge:cookieTimeout*60000});
        response.send(stat);
        console.log(Date(),'manual login successful' ,request.ip );
    }).catch((stat)=>{
        response.send(stat);
        console.log(Date(),'manual login failed',request.ip);
      })
    }
  });
  app.post('/signup',(request,response)=> { 
    if(Object.keys(request.cookies).length===0){
        addUser(request.body.name,request.body.email,request.body.password).then(() =>{
        response.send(1);
        console.log(Date(),'manual login successful' ,request.ip );
    }).catch((stat)=>{
        response.send(stat);
        console.log(Date(),'manual login failed',request.ip);
      })
    }
  });
  app.post('/commit',(request,response)=> { 
    if(Object.keys(request.cookies).length!=0){
        commit(request.cookies.auth,toCol(new Date())).then(() =>{
        response.send(1);
        console.log(Date(),'manual login successful' ,request.ip );
    }).catch((stat)=>{
        response.send(stat);
        console.log(Date(),'manual login failed',request.ip);
      })
    }
  });
  app.post('/logs',(request,response)=> { 
    if(Object.keys(request.cookies).length!=0){
        getLogs(request.cookies.auth,toCol(new Date())).then((resp) =>{
        response.send(resp);
        console.log(Date(),'manual login successful' ,request.ip );
    }).catch((stat)=>{
        response.send(stat);
        console.log(Date(),'manual login failed',request.ip);
      })
    }
  });
    
  app.post('/logout',(request,response)=> {
      response.cookie('auth',null,{maxAge:0});
      response.send(1);
      console.log(Date(), 'logout', request.ip);
    });


  app.listen(appPort,()=>{
    console.log(Date(), `APP SERVER ONLINE http://localhost:${appPort}`);
  });
  /////////////////////////////////////////////////////database queries////////////////////////////////////////////////////////////////
  const ONE_DAY= 86400000;

//converts date to column name
const toCol = (date) => {
    s= `t${date.getUTCFullYear()}${date.getUTCMonth()}${date.getUTCDate()}`; 
    return s;
};
//adds a new day column before each day starts
const updateCol = async () => { 
    let tomorrow =new Date(); 
    tomorrow.setDate(tomorrow.getDate()+1);
    await addColumn(toCol(tomorrow)); 
};
//prints db
const print = async () => {
    const rs = await client.execute(`SELECT * FROM ${process.env.table};`);
    console.log(`Your cluster returned ${rs.rowLength} row(s)`);
    console.log(rs.rows);
}
//runs at begining
const setup = async () => { 
    await client.connect(); 
    await client.execute(`USE ${process.env.keyspace};`);
    await createTable();
    let today =new Date();
    setInterval(updateCol, ONE_DAY);
    await addColumn(toCol(today));
    await updateCol();
};
//INSERT INTO users (name,email,password_hash,cookie_hash) VALUES ('lol','a@b.com','asdf','qwer');
//root functions
const stop        = async () =>   await client.shutdown();
const createTable = async () =>   await client.execute(`CREATE TABLE IF NOT EXISTS ${process.env.table} (email TEXT PRIMARY KEY, name TEXT, password_hash TEXT, cookie_hash TEXT);`);
const dropTable   = async () =>   await client.execute(`DROP TABLE IF EXISTS ${process.env.table}`);
const reset       = async () => { await dropTable(); await createTable();}

//data manupulation
const addColumn =   async (col) => await client.execute(`ALTER TABLE ${process.env.table} ADD ${col} INT`).catch((err)=>console.log(`ignoring ${col} column already exists`));
const addUser   =   async (name,email,password_hash)    => await client.execute(`INSERT INTO ${process.env.table} (name,email,password_hash) VALUES ('${name}','${email}','${password_hash}');`);
const addcookie =   async (email,cookie_hash) => await client.execute(`UPDATE ${process.env.table} SET cookie_hash = '${cookie_hash}' WHERE EMAIL = '${email}'`)
const commit =   async (cookie_hash,col) => {
    let rs = await client.execute(`SELECT ${col},email FROM ${process.env.table} WHERE cookie_hash = '${cookie_hash}' ALLOW FILTERING;`);
    let v=rs.rows[0][col];
    if(v==null) v=1;
    else v++;
    await client.execute(`UPDATE ${process.env.table} SET ${col} = ${v} WHERE email = '${rs.rows[0].email}'`);
};
const getLogs =  async (cookie_hash)  =>{
    return myPromise = new Promise(async(success, fail) =>{
        let rs = await client.execute(`SELECT * FROM ${process.env.table} WHERE cookie_hash = '${cookie_hash}' ALLOW FILTERING;`);
        if(rs.rowLength==1){
            row=rs.rows[0];
            delete row.cookie_hash;
            delete row.password_hash;
            success({'pass': true , 'data' : row});
        }else
            fail({'pass' : false});
  })};
  const auth =  async (email,password_hash)  =>{
    return myPromise = new Promise(async(success, fail) =>{
        let rs = await client.execute(`SELECT password_hash FROM ${process.env.table} WHERE email = '${email}' ALLOW FILTERING;`);
        if(rs.rowLength==1){
            row=rs.rows[0];
            if(row.password_hash==password_hash)
                success({'pass':true});
            else
                fail({'pass': false,'email':true});
        }else
            fail({'pass': false,'email':false});
  })};


  async function test() {
      await setup();
      //await print();
     // await reset();
     // await print();
      await addUser('sayan','sayan@gmail.com','cygaigk')
      await addUser('say2an','say2an@gmail.com','cygai2gk')
      await getLogs('cygaigk').then((a)=>console.log(a)).catch((a)=>console.log('b',a));
      await getLogs('csaigk').then((a)=>console.log(a)).catch((a)=>console.log('b',a));
      await auth('a@b.com','asdf').then(()=>console.log("success")).catch((a)=>console.log('error:',a))
      await auth('a@b.com','aasdf').then(()=>console.log("success")).catch((a)=>console.log('error:',a))
      await auth('a@ab.com','asdf').then(()=>console.log("success")).catch((a)=>console.log('error:',a))
      await addcookie('a@b.com','qwerty')
      await commit('qwerty',toCol(new Date()))
      stop();

  }
test()
