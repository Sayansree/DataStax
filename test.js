const { Client } = require("cassandra-driver");
var dotenv = require('dotenv');
var cors = require('cors');

dotenv.config();
const client = new Client({
    cloud: { secureConnectBundle: __dirname+ `/secure/secure-connect-${process.env.db}.zip` },
    credentials: { username: `${process.env.username}`, password: `${process.env.password}` }
  });
async function setup() {
    await client.connect();
    await client.execute(`USE ${process.env.keyspace};`);

}
async function print() {
    const rs = await client.execute(`SELECT * FROM ${process.env.table};`);
    console.log(`Your cluster returned ${rs.rowLength} row(s)`);
    console.log(rs.rows[0].email);
}
const stop =        async () => await client.shutdown();
const createTable = async ()    => await client.execute(`CREATE TABLE IF NOT EXISTS ${process.env.table} (email TEXT PRIMARY KEY, name TEXT, password_hash TEXT, cookie_hash TEXT);`);
const addColumn =   async (col) => await client.execute(`ALTER TABLE ${process.env.table} ADD t${col} INT`);
const dropTable =   async ()    => await client.execute(`DROP TABLE IF EXISTS ${process.env.table}`);
const reset     =   async ()    => { dropTable(); createTable();}
const addUser   =   async (name,email,hash)    => await client.execute(`INSERT INTO ${process.env.table} (name,email,password_hash) VALUES ('${name}','${email}','${hash}');`);
const getCommits =  async (cookie_hash)  =>{
    return myPromise = new Promise((success, fail) =>{
        const rs = await client.execute(`SELECT t* FROM ${process.env.table} WHERE cookie_hash = ${cookie_hash};`);
        if(1)
            success();
        else
            fail();
  })};

setup();
//dropTable();
print();
//createTable();
//reset();
// var s =new Date();
// s=s.toISOString();
// s=s.substr(0,4)+s.substr(5,2)+s.substr(8,2)
// //addColumn(s)
// addUser('sayan','sayan@gmail.com','cygaigk')

// print();

stop();