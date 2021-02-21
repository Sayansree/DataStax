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
    s=date.toISOString(); 
    s='t'+s.substr(0,4)+s.substr(5,2)+s.substr(8,2); 
    return s;
};
const updateCol = async () => { 
    let tommrow =new Date(); 
    tommrow.setDate(tommrow.getDate()+1);
    await addColumn(toCol(today)); 
};
//

const setup       = async () => { 
    await client.connect(); 
    await client.execute(`USE ${process.env.keyspace};`);
    await createTable();
    let today =new Date();
    await addColumn(toCol(today));
    setInterval(updateCol, ONE_DAY);
};
//root functions
const stop        = async () =>   await client.shutdown();
const createTable = async () =>   await client.execute(`CREATE TABLE IF NOT EXISTS ${process.env.table} (email TEXT PRIMARY KEY, name TEXT, password_hash TEXT, cookie_hash TEXT);`);
const dropTable   = async () =>   await client.execute(`DROP TABLE IF EXISTS ${process.env.table}`);
const reset       = async () => { await dropTable(); await createTable();}

//data manupulation
const addColumn =   async (col) => await client.execute(`ALTER TABLE ${process.env.table} ADD ${col} INT`);
const addUser   =   async (name,email,hash)    => await client.execute(`INSERT INTO ${process.env.table} (name,email,cookie_hash) VALUES ('${name}','${email}','${hash}');`);
const getCommits =  async (cookie_hash)  =>{
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

  async function test() {
      await setup();
      await print();
     // await reset();
     // await print();
      await addUser('sayan','sayan@gmail.com','cygaigk')
      await addUser('say2an','say2an@gmail.com','cygai2gk')
      await getCommits('cygaigk').then((a)=>console.log(a)).catch((a)=>console.log('b',a));
      await getCommits('csaigk').then((a)=>console.log(a)).catch((a)=>console.log('b',a));
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

