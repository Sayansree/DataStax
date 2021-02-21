const { Client } = require("cassandra-driver");
var dotenv = require('dotenv');
var cors = require('cors');

dotenv.config();
const client = new Client({
    cloud: { secureConnectBundle: __dirname+ `/secure/secure-connect-${process.env.db}.zip` },
    credentials: { username: `${process.env.username}`, password: `${process.env.password}` }
  });

async function print() {
    const rs = await client.execute(`SELECT * FROM ${process.env.table};`);
    console.log(`Your cluster returned ${rs.rowLength} row(s)`);
    console.log(rs.rows);
}
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
//

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
                success();
            else
                fail({'email':true});
        }else
            fail({'email':false});
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
      stop();

  }
test()
//dropTable();

//createTable();
//reset();
// var s =new Date();
// s=s.toISOString();
// s=t+s.substr(0,4)+s.substr(5,2)+s.substr(8,2)
// //addColumn(s)
// addUser('sayan','sayan@gmail.com','cygaigk')

// print();

