const { Client } = require("cassandra-driver");
var dotenv = require('dotenv');
var cors = require('cors');

dotenv.config();

async function run() {
    const client = new Client({
      cloud: { secureConnectBundle: __dirname+ "/secure/secure-connect-simpleDB.zip" },
      credentials: { username: `${process.env.username}`, password: `${process.env.password}` }
    });
  
    await client.connect();

    const rs = await client.execute("USE health_hub;");//SELECT * FROM simplekeyspace");
    console.log(`Your cluster returned ${rs.rowLength} row(s)`);
    console.log(rs);
  
    await client.shutdown();

  }
  
  run();
