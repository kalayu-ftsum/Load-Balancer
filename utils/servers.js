const express=require('express');

// Create servers
const PORT1=3001, PORT2=3002;
const server1=express();
const server2=express();

server1.use((req,res,next)=>res.send('Server 1'));
server2.use((req,res,next)=>res.send('Server 2'));

const healthCheck=(serverName)=>(req, res)=>{
    try {
      //checks database connectivity, server health, and other resource.
      res.status(200).send(`${serverName} is healthy`);
    } catch (err) {
      console.error(`${serverName}check fialed : ${err}`);
      res.status(500).send(`${serverName} is healthy`);
    }
  }
  
server1.get('/health', healthCheck('Server 1'));
server2.get('/health',healthCheck('Server 2'));

server1.listen(PORT1,()=>console.log('Server 1 is running'));
server2.listen(PORT2,()=>console.log('Server 2 is running'));